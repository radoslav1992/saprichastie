import type { APIRoute } from 'astro';
import computerTraining from '../../../assets/photos/computer-training.jpg';
import showdownPractice from '../../../assets/photos/showdown-practice.jpg';
import supportGroup from '../../../assets/photos/support-group.jpg';
import urbanOrientation from '../../../assets/photos/urban-orientation.jpg';
import brailleTrainingChildren from '../../../assets/photos/braille-training-children.jpg';
import whiteCaneDemonstration from '../../../assets/photos/white-cane-demonstration.jpg';
import centerGroup from '../../../assets/photos/center-group.jpg';
import mobilityObstacles from '../../../assets/photos/mobility-obstacles.jpg';
import kindnessMessage from '../../../assets/photos/kindness-message.jpg';
import { adminConfigured, loadGalleryItems, saveGalleryItems, type GalleryItem } from '../../../lib/gallery';
import { isAdmin } from '../../../lib/admin-auth';
import { bg } from '../../../i18n/bg';
import { en } from '../../../i18n/en';

export const prerender = false;

const BUILT_IN: Record<string, ImageMetadata> = {
  'computer-training': computerTraining,
  'showdown-practice': showdownPractice,
  'support-group': supportGroup,
  'urban-orientation': urbanOrientation,
  'braille-training-children': brailleTrainingChildren,
  'white-cane-demonstration': whiteCaneDemonstration,
  'center-group': centerGroup,
  'mobility-obstacles': mobilityObstacles,
  'kindness-message': kindnessMessage,
};

/**
 * Copies the built-in gallery photos (bundled as static assets) into R2 and
 * registers them in KV with their existing bilingual captions, so the admin
 * can edit and reorder them like any uploaded photo.
 */
export const POST: APIRoute = async ({ request, locals, cookies, redirect }) => {
  const env = locals.runtime?.env;
  if (!adminConfigured(env) || !(await isAdmin(cookies, env))) {
    return redirect('/admin/login', 303);
  }

  try {
    const existing = (await loadGalleryItems(env)) ?? [];
    if (existing.length > 0) return redirect('/admin?status=error', 303);

    const items: GalleryItem[] = [];
    for (const [i, bgItem] of bg.gallery.items.entries()) {
      const meta = BUILT_IN[bgItem.key];
      if (!meta) continue;
      const assetUrl = new URL(meta.src, request.url);
      const res = await env!.ASSETS.fetch(assetUrl);
      if (!res.ok) continue;
      const key = `gallery/seed-${bgItem.key}.jpg`;
      await env!.GALLERY_BUCKET!.put(key, await res.arrayBuffer(), {
        httpMetadata: { contentType: 'image/jpeg' },
      });
      items.push({
        id: crypto.randomUUID(),
        key,
        captionBg: bgItem.caption,
        captionEn: en.gallery.items[i]?.caption ?? bgItem.caption,
      });
    }

    if (!items.length) return redirect('/admin?status=error', 303);
    await saveGalleryItems(env!, items);
    return redirect('/admin?status=seeded', 303);
  } catch (error) {
    console.error('Gallery seed failed:', error);
    return redirect('/admin?status=error', 303);
  }
};
