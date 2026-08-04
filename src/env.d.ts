/// <reference types="astro/client" />

declare module 'cloudflare:email' {
  export class EmailMessage {
    constructor(from: string, to: string, raw: string);
    readonly from: string;
    readonly to: string;
  }
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
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
