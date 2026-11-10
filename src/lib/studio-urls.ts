/** Public origins stay separate even though both sites share one Vercel project. */
export const STUDIO_ORIGIN = 'https://quinnsoftwarestudio.com';
export const PORTFOLIO_ORIGIN = 'https://joequinn.dev';

// Keep development and Vercel preview navigation inside the preview deployment.
const usePreviewPaths = import.meta.env.DEV || process.env.VERCEL_ENV === 'preview';

export function studioPath(path = '') {
  const normalized = path.replace(/^\/studio(?=\/|#|\?|$)/, '');
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

export function studioCanonical(path = '') {
  return new URL(studioPath(path), STUDIO_ORIGIN).href;
}

export function studioHref(path = '') {
  const normalized = studioPath(path);
  return usePreviewPaths ? `/studio${normalized === '/' ? '' : normalized}` : studioCanonical(path);
}

export function portfolioHref(path = '/') {
  return usePreviewPaths ? path : new URL(path, PORTFOLIO_ORIGIN).href;
}
