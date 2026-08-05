/** Gallery storage: image files live in R2, ordering + captions in KV. */

export interface GalleryItem {
  id: string;
  /** R2 object key, e.g. "gallery/1712345678-photo.jpg". */
  key: string;
  captionBg: string;
  captionEn: string;
}

const INDEX_KEY = 'gallery:index';

export function galleryConfigured(env: Env | undefined): boolean {
  return Boolean(env?.GALLERY_KV && env?.GALLERY_BUCKET);
}

export function adminConfigured(env: Env | undefined): boolean {
  return galleryConfigured(env) && Boolean(env?.ADMIN_PASSWORD);
}

/**
 * Items managed through the admin panel, or null when the gallery
 * bindings are absent or nothing has been uploaded yet — callers then
 * fall back to the built-in photo set.
 */
export async function loadGalleryItems(env: Env | undefined): Promise<GalleryItem[] | null> {
  if (!env?.GALLERY_KV) return null;
  try {
    const data = (await env.GALLERY_KV.get(INDEX_KEY, 'json')) as { items?: GalleryItem[] } | null;
    return data?.items?.length ? data.items : null;
  } catch {
    return null;
  }
}

export async function saveGalleryItems(env: Env, items: GalleryItem[]): Promise<void> {
  if (!env.GALLERY_KV) throw new Error('GALLERY_KV is not configured');
  await env.GALLERY_KV.put(INDEX_KEY, JSON.stringify({ items }));
}
