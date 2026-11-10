import { STUDIO_ORIGIN } from '../../lib/studio-urls';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${STUDIO_ORIGIN}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
