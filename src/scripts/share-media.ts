// Client-side helper for sharing a media file via the Web Share API, with a
// plain download as the fallback. Never re-encodes or resizes the media: it
// fetches the file bytes as-is and hands them to the OS share sheet.
//
// Only import this from client <script> blocks — it touches `navigator` and
// `document`.
//
// iOS quirk this file works around: `navigator.share()` may only be called
// while the user's tap is still "fresh" (transient user activation, a few
// seconds). If fetching a large video takes longer than that, share() throws
// NotAllowedError even though the bytes arrived fine. To keep that rare, we
// cache prepared File objects so a repeat tap (or a prefetched item) can call
// share() instantly, well inside the activation window.

// Prefer an extension-derived MIME type over `blob.type`: dev servers and some
// hosts report videos as generic `application/octet-stream`, which makes iOS
// refuse to offer "Save Video".
const MIME_BY_EXT: Record<string, string> = {
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
	avif: 'image/avif',
	gif: 'image/gif',
	mp4: 'video/mp4',
	m4v: 'video/mp4',
	mov: 'video/quicktime',
	webm: 'video/webm',
};

const extensionOf = (filename: string): string => {
	const dot = filename.lastIndexOf('.');
	return dot >= 0 ? filename.slice(dot + 1).toLowerCase() : '';
};

// Small in-memory cache of prepared files, keyed by URL. Bounded so browsing
// through many large videos doesn't pile up memory.
const MAX_CACHED_FILES = 4;
const fileCache = new Map<string, Promise<File>>();

async function fetchMediaFile(url: string, filename: string): Promise<File> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch media: ${response.status}`);
	}
	const blob = await response.blob();
	const type =
		MIME_BY_EXT[extensionOf(filename)] ||
		blob.type ||
		'application/octet-stream';
	return new File([blob], filename, { type });
}

/**
 * Fetch `url` and wrap it in a File, deduped and cached in memory. Safe to
 * call ahead of time (e.g. when a video opens in the lightbox) so a later
 * share can resolve instantly. Failed fetches are evicted so a retry can
 * try again.
 */
export function prepareMediaFile(
	url: string,
	filename: string,
): Promise<File> {
	const cached = fileCache.get(url);
	if (cached) return cached;

	const promise = fetchMediaFile(url, filename);
	promise.catch(() => fileCache.delete(url));

	if (fileCache.size >= MAX_CACHED_FILES) {
		const oldest = fileCache.keys().next().value;
		if (oldest !== undefined) fileCache.delete(oldest);
	}
	fileCache.set(url, promise);
	return promise;
}

export type ShareOutcome = 'shared' | 'downloaded' | 'cancelled' | 'retry';

/**
 * Open the native share sheet for the media at `url` (iOS/Android), or
 * download it on browsers without file sharing.
 *
 * Must be called from a user gesture (e.g. a click handler).
 *
 * Outcomes:
 * - 'shared'     — share sheet opened and completed.
 * - 'cancelled'  — user dismissed the share sheet; not an error.
 * - 'downloaded' — no file-share support; delivered as a download instead.
 * - 'retry'      — the download outlasted the tap's activation window, so the
 *                  OS refused to open the share sheet. The file is now cached:
 *                  prompt the user to tap again and it will share instantly.
 *
 * Throws on network or unexpected share errors.
 */
export async function shareMedia(
	url: string,
	filename: string,
): Promise<ShareOutcome> {
	const file = await prepareMediaFile(url, filename);

	if (
		typeof navigator.share === 'function' &&
		navigator.canShare?.({ files: [file] })
	) {
		try {
			await navigator.share({ files: [file] });
			return 'shared';
		} catch (err) {
			if (err instanceof DOMException) {
				if (err.name === 'AbortError') return 'cancelled';
				if (err.name === 'NotAllowedError') return 'retry';
			}
			throw err;
		}
	}

	downloadFile(file);
	return 'downloaded';
}

function downloadFile(file: File): void {
	const objectUrl = URL.createObjectURL(file);
	const a = document.createElement('a');
	a.href = objectUrl;
	a.download = file.name;
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
