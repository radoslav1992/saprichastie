/**
 * Thin client for the Internet Archive (archive.org) public APIs, used by
 * the Библиотека / Library pages to list Bulgarian-language LibriVox
 * audiobooks. API responses are cached at the Cloudflare edge for an hour.
 */

export interface ArchiveDoc {
  identifier: string;
  title: string;
  creator?: string;
  year?: string;
}

export interface ArchiveSearchResult {
  docs: ArchiveDoc[];
  total: number;
  page: number;
  pages: number;
}

export interface ArchiveTrack {
  /** File path within the item, e.g. "chapter_01_64kb.mp3". */
  name: string;
  title: string;
  seconds?: number;
}

export interface ArchiveItem {
  identifier: string;
  title: string;
  creator?: string;
  year?: string;
  description?: string;
  mediatype: string;
  /** Playable audio files, in listening order. */
  tracks: ArchiveTrack[];
}

export const PAGE_SIZE = 24;
const MAX_PAGES = 50;

/** Overridable for tests via the optional ARCHIVE_BASE var. */
export function archiveBase(env: Env | undefined): string {
  return env?.ARCHIVE_BASE || 'https://archive.org';
}

const ID_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,120}$/;

export function isValidIdentifier(id: string | undefined): id is string {
  return typeof id === 'string' && ID_RE.test(id);
}

function first(value: unknown): string | undefined {
  if (Array.isArray(value)) value = value[0];
  if (typeof value === 'number') return String(value);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

/** "125.4" (seconds) or "h:mm:ss" / "mm:ss" → whole seconds. */
function parseLength(value: unknown): number | undefined {
  const s = first(value);
  if (!s) return undefined;
  if (/^\d+(\.\d+)?$/.test(s)) return Math.round(parseFloat(s));
  const parts = s.split(':').map((p) => parseInt(p, 10));
  if (!parts.length || parts.some((p) => Number.isNaN(p))) return undefined;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

/** Direct download URL for a file inside an item. */
export function trackUrl(env: Env | undefined, identifier: string, name: string): string {
  const path = name.split('/').map(encodeURIComponent).join('/');
  return `${archiveBase(env)}/download/${identifier}/${path}`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = h ? String(m).padStart(2, '0') : String(m);
  return `${h ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`;
}

/**
 * Pick one playable MP3 per chapter. Items usually carry several encodings
 * of every chapter — prefer the small 64kbps files (spoken word is fine at
 * that bitrate and they start fastest), then fall back to other MP3s.
 */
function extractTracks(files: unknown): ArchiveTrack[] {
  if (!Array.isArray(files)) return [];
  const mp3s = (files as Record<string, unknown>[]).filter(
    (f) => typeof f.name === 'string' && /\.mp3$/i.test(f.name)
  );
  const ofFormat = (fmt: string) => mp3s.filter((f) => first(f.format)?.toLowerCase() === fmt);
  let chosen = ofFormat('64kbps mp3');
  if (!chosen.length) chosen = ofFormat('vbr mp3');
  if (!chosen.length) chosen = ofFormat('128kbps mp3');
  if (!chosen.length) chosen = mp3s;

  const trackNo = (f: Record<string, unknown>) => {
    const n = parseInt(first(f.track) ?? '', 10);
    return Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
  };
  chosen.sort(
    (a, b) =>
      trackNo(a) - trackNo(b) ||
      String(a.name).localeCompare(String(b.name), undefined, { numeric: true })
  );

  return chosen.map((f, i) => ({
    name: f.name as string,
    title:
      first(f.title) ??
      (f.name as string).replace(/\.mp3$/i, '').replace(/[_-]+/g, ' ').trim() ??
      `${i + 1}`,
    seconds: parseLength(f.length),
  }));
}

/** Keep only letters/digits/spaces so user input cannot alter the query syntax. */
function sanitizeQuery(q: string): string {
  return q
    .replace(/[^\p{L}\p{N} ]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);
}

function cachedFetch(url: string): Promise<Response> {
  return fetch(url, {
    headers: { Accept: 'application/json' },
    // Cloudflare edge cache; ignored by other runtimes (astro dev)
    cf: { cacheTtl: 3600, cacheEverything: true },
  } as RequestInit);
}

/** LibriVox audiobooks in Bulgarian, hosted on the Internet Archive. */
export async function searchLibrivoxBulgarian(
  env: Env | undefined,
  options: { query?: string; page?: number }
): Promise<ArchiveSearchResult | null> {
  const page = Math.min(Math.max(options.page ?? 1, 1), MAX_PAGES);

  let q = 'collection:librivoxaudio AND (language:bul OR language:bulgarian)';
  const extra = sanitizeQuery(options.query ?? '');
  if (extra) q += ` AND (${extra})`;

  const params = new URLSearchParams({
    q,
    rows: String(PAGE_SIZE),
    page: String(page),
    output: 'json',
  });
  for (const field of ['identifier', 'title', 'creator', 'year']) params.append('fl[]', field);
  params.append('sort[]', 'downloads desc');

  try {
    const res = await cachedFetch(`${archiveBase(env)}/advancedsearch.php?${params}`);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      response?: { numFound?: number; docs?: Record<string, unknown>[] };
    };
    const rawDocs = data.response?.docs ?? [];
    const total = data.response?.numFound ?? 0;
    const docs: ArchiveDoc[] = rawDocs
      .filter((d) => isValidIdentifier(first(d.identifier)))
      .map((d) => ({
        identifier: first(d.identifier)!,
        title: first(d.title) ?? first(d.identifier)!,
        creator: first(d.creator),
        year: first(d.year),
      }));
    return { docs, total, page, pages: Math.min(Math.ceil(total / PAGE_SIZE), MAX_PAGES) };
  } catch {
    return null;
  }
}

export async function fetchArchiveItem(env: Env | undefined, id: string): Promise<ArchiveItem | null> {
  if (!isValidIdentifier(id)) return null;
  try {
    const res = await cachedFetch(`${archiveBase(env)}/metadata/${id}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { metadata?: Record<string, unknown>; files?: unknown };
    const meta = data.metadata;
    if (!meta) return null;

    // descriptions may contain HTML — reduce to plain text
    const description = first(meta.description)
      ?.replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 800);

    return {
      identifier: id,
      title: first(meta.title) ?? id,
      creator: first(meta.creator),
      year: first(meta.year) ?? first(meta.date),
      description: description || undefined,
      mediatype: first(meta.mediatype) ?? 'audio',
      tracks: extractTracks(data.files),
    };
  } catch {
    return null;
  }
}
