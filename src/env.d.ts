/// <reference types="astro/client" />

declare module 'cloudflare:email' {
  export class EmailMessage {
    constructor(from: string, to: string, raw: string);
    readonly from: string;
    readonly to: string;
  }
}

/** Minimal KV namespace surface used by the gallery. */
interface GalleryKV {
  get(key: string, type: 'json'): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
}

/** Minimal R2 bucket surface used by the gallery. */
interface GalleryR2Object {
  body: ReadableStream;
  httpEtag: string;
  httpMetadata?: { contentType?: string };
}

interface GalleryR2 {
  put(
    key: string,
    value: ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string } }
  ): Promise<unknown>;
  get(key: string): Promise<GalleryR2Object | null>;
  delete(key: string): Promise<void>;
}

interface Env {
  /** Email Routing send binding (see wrangler.jsonc). */
  CONTACT_EMAIL: {
    send(message: import('cloudflare:email').EmailMessage): Promise<void>;
  };
  /** Envelope sender address on the saprichastie.org domain. */
  CONTACT_FROM: string;
  /** Verified destination mailbox for contact-form messages. */
  CONTACT_TO: string;
  /** Static assets binding (wrangler.jsonc assets.binding). */
  ASSETS: { fetch(input: Request | URL | string): Promise<Response> };
  /**
   * Optional gallery admin bindings — the admin panel activates only when
   * all three are configured (see the README's "Admin panel" section).
   */
  GALLERY_KV?: GalleryKV;
  GALLERY_BUCKET?: GalleryR2;
  ADMIN_PASSWORD?: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
