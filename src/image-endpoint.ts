import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Runtime /_image endpoint for server-rendered pages.
 *
 * The adapter's default endpoint fetches the worker's own origin, which
 * Cloudflare blocks (a Worker cannot fetch its own hostname), leaving
 * broken images on server-rendered routes. This endpoint serves the
 * original file through the ASSETS binding instead. Prerendered pages are
 * unaffected — their images are still optimized by sharp at build time.
 */
export const GET: APIRoute = async (ctx) => {
  const href = ctx.url.searchParams.get('href');
  if (!href) return new Response("Missing 'href' query parameter", { status: 400 });

  if (/^https?:\/\//.test(href)) return new Response('Forbidden', { status: 403 });

  const proxied = new URL(href, ctx.url.origin);
  if (proxied.origin !== ctx.url.origin) return new Response('Forbidden', { status: 403 });

  const env = ctx.locals.runtime?.env;
  const response = env?.ASSETS ? await env.ASSETS.fetch(proxied) : await fetch(proxied);
  if (!response.ok) return new Response('Not found', { status: 404 });

  const headers = new Headers(response.headers);
  // asset URLs are content-hashed, so cache hard
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  return new Response(response.body, { status: response.status, headers });
};
