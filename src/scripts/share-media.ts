// Client-side helper for sharing a media file via the Web Share API, with a
// plain download as the fallback. Never re-encodes or resizes the media: it
// fetches the file bytes as-is and hands them to the OS share sheet.
//
// Only import this from client <script> blocks — it touches `navigator` and
// `document`.

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

export type ShareOutcome = 'shared' | 'downloaded' | 'cancelled';

/**
 * Fetch `url`, wrap it in a File named `filename`, and open the native share
 * sheet where supported (iOS/Android). Falls back to downloading the file on
 * desktop and other browsers without file sharing.
 *
 * Must be called from a user gesture (e.g. a click handler) so the browser
 * grants access to `navigator.share()`.
 *
 * Returns how the media was delivered; throws on network or unexpected
 * share errors. A user dismissing the share sheet resolves to 'cancelled'
 * rather than throwing.
 */
export async function shareMedia(
	url: string,
	filename: string,
): Promise<ShareOutcome> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch media: ${response.status}`);
	}
	const blob = await response.blob();

	const type =
		MIME_BY_EXT[extensionOf(filename)] ||
		blob.type ||
		'application/octet-stream';
	const file = new File([blob], filename, { type });

	if (
		typeof navigator.share === 'function' &&
		navigator.canShare?.({ files: [file] })
	) {
		try {
			await navigator.share({ files: [file] });
			return 'shared';
		} catch (err) {
			if (err instanceof DOMException) {
				// User closed the share sheet — not an error.
				if (err.name === 'AbortError') return 'cancelled';
				// The click's "user activation" expired while a large file was
				// downloading. The bytes are already here, so just save them.
				if (err.name === 'NotAllowedError') {
					downloadBlob(blob, filename);
					return 'downloaded';
				}
			}
			throw err;
		}
	}

	downloadBlob(blob, filename);
	return 'downloaded';
}

function downloadBlob(blob: Blob, filename: string): void {
	const objectUrl = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = objectUrl;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
