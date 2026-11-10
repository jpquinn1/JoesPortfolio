import { caseStudies } from '../../data/studio';
import { studioCanonical } from '../../lib/studio-urls';

export function GET() {
  const pages = ['', '/privacy', ...caseStudies.map((study) => `/work/${study.slug}`)];
  const entries = pages.map((path) => `<url><loc>${studioCanonical(path)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
