import type { APIRoute } from 'astro';
import { adminConfigured, loadGalleryItems, saveGalleryItems } from '../../../lib/gallery';
import { isAdmin } from '../../../lib/admin-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, cookies, redirect }) => {
  const env = locals.runtime?.env;
  if (!adminConfigured(env) || !(await isAdmin(cookies, env))) {
    return redirect('/admin/login', 303);
  }

  try {
    const form = await request.formData();
    const id = String(form.get('id') ?? '');
    const action = String(form.get('_action') ?? '');

    const items = (await loadGalleryItems(env)) ?? [];
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return redirect('/admin?status=error', 303);

    if (action === 'save') {
      const captionBg = String(form.get('captionBg') ?? '').trim();
      const captionEn = String(form.get('captionEn') ?? '').trim();
      if (!captionBg || !captionEn) return redirect('/admin?status=error', 303);
      items[index] = { ...items[index]!, captionBg, captionEn };
      await saveGalleryItems(env!, items);
      return redirect('/admin?status=saved', 303);
    }

    if (action === 'up' || action === 'down') {
      const target = action === 'up' ? index - 1 : index + 1;
      if (target >= 0 && target < items.length) {
        [items[index], items[target]] = [items[target]!, items[index]!];
        await saveGalleryItems(env!, items);
      }
      return redirect('/admin?status=moved', 303);
    }

    if (action === 'delete') {
      const [removed] = items.splice(index, 1);
      await saveGalleryItems(env!, items);
      if (removed) await env!.GALLERY_BUCKET!.delete(removed.key);
      return redirect('/admin?status=deleted', 303);
    }

    return redirect('/admin?status=error', 303);
  } catch (error) {
    console.error('Gallery item update failed:', error);
    return redirect('/admin?status=error', 303);
  }
};
