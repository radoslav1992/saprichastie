import type { APIRoute } from 'astro';

export const prerender = false;

/** Streams gallery images from R2. Keys are unique per upload, so cache hard. */
export const GET: APIRoute = async ({ params, locals }) => {
  const env = locals.runtime?.env;
  const key = params.key;
  if (!env?.GALLERY_BUCKET || !key || !key.startsWith('gallery/')) {
    return new Response('Not found', { status: 404 });
  }

  const object = await env.GALLERY_BUCKET.get(key);
  if (!object) return new Response('Not found', { status: 404 });

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType ?? 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: object.httpEtag,
    },
  });
};
