/// <reference types="astro/client" />

type SendEmailBinding = {
  send(message: import('cloudflare:email').EmailMessage): Promise<void>;
};

interface CloudflareEnv {
  CONTACT_EMAIL?: SendEmailBinding;
  CONTACT_SENDER?: string;
  CONTACT_RECIPIENT?: string;
}

declare module 'cloudflare:email' {
  export class EmailMessage {
    constructor(from: string, to: string, raw: string);
    readonly from: string;
    readonly to: string;
  }
}
