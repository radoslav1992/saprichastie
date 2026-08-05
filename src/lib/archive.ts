/**
 * Thin client for the Internet Archive (archive.org) public APIs, used by
 * the Библиотека / Library pages to list Bulgarian-language books and
 * audiobooks. API responses are cached at the Cloudflare edge for an hour.
 */

export type ArchiveMediaType = 'texts' | 'audio';

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

export interface ArchiveItem {
  identifier: string;
  title: string;
  creator?: string;
  year?: string;
  description?: string;
  mediatype: ArchiveMediaType | string;
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

export async function searchBulgarianBooks(
  env: Env | undefined,
  options: { query?: string; mediatype?: ArchiveMediaType; page?: number }
): Promise<ArchiveSearchResult | null> {
  const mediatype: ArchiveMediaType = options.mediatype === 'audio' ? 'audio' : 'texts';
  const page = Math.min(Math.max(options.page ?? 1, 1), MAX_PAGES);

  let q = `(language:bul OR language:bulgarian) AND mediatype:${mediatype}`;
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
    const data = (await res.json()) as { metadata?: Record<string, unknown> };
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
      mediatype: first(meta.mediatype) ?? 'texts',
    };
  } catch {
    return null;
  }
}
