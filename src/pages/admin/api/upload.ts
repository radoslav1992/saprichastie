import type { APIRoute } from 'astro';
import { adminConfigured, loadGalleryItems, saveGalleryItems } from '../../../lib/gallery';
import { isAdmin } from '../../../lib/admin-auth';

export const prerender = false;

const MAX_BYTES = 8 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const POST: APIRoute = async ({ request, locals, cookies, redirect }) => {
  const env = locals.runtime?.env;
  if (!adminConfigured(env) || !(await isAdmin(cookies, env))) {
    return redirect('/admin/login', 303);
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    const captionBg = String(form.get('captionBg') ?? '').trim();
    const captionEn = String(form.get('captionEn') ?? '').trim();

    if (!(file instanceof File) || !captionBg || !captionEn) {
      return redirect('/admin?status=error', 303);
    }
    const ext = EXTENSIONS[file.type];
    if (!ext) return redirect('/admin?status=badtype', 303);
    if (file.size > MAX_BYTES) return redirect('/admin?status=toobig', 303);

    const key = `gallery/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    await env!.GALLERY_BUCKET!.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });

    const items = (await loadGalleryItems(env)) ?? [];
    items.push({ id: crypto.randomUUID(), key, captionBg, captionEn });
    await saveGalleryItems(env!, items);

    return redirect('/admin?status=uploaded', 303);
  } catch (error) {
    console.error('Gallery upload failed:', error);
    return redirect('/admin?status=error', 303);
  }
};
