import type { APIRoute } from 'astro';
import { Buffer } from 'node:buffer';
import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage, Mailbox } from 'mimetext';

export const prerender = false;

/**
 * Receives the contact form and forwards it as an email through the
 * Cloudflare Email Routing binding (CONTACT_EMAIL in wrangler.jsonc).
 * The visitor's address goes into Reply-To, so answering the notification
 * email replies straight to them.
 */
export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const form = await request.formData();
  const lang = form.get('lang') === 'en' ? 'en' : 'bg';
  const prefix = lang === 'en' ? '/en' : '';

  // Honeypot: real visitors never see this field. Pretend success for bots.
  if ((form.get('website') as string)?.trim()) {
    return redirect(`${prefix}/contact/sent`, 303);
  }

  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk || !message || name.length > 200 || email.length > 200 || message.length > 5000) {
    return redirect(`${prefix}/contact/error`, 303);
  }

  try {
    const env = locals.runtime.env;
    const msg = createMimeMessage();
    msg.setSender({ name: 'Saprichastie Website', addr: env.CONTACT_FROM });
    msg.setRecipient(env.CONTACT_TO);
    msg.setHeader('Reply-To', new Mailbox({ addr: email, name: name.replace(/[<>\r\n"]/g, '') }));
    msg.setSubject(`Съобщение от сайта — ${name}`);
    const body = [
      `Ново съобщение от контактната форма на saprichastie.org`,
      ``,
      `Име: ${name}`,
      `Имейл: ${email}`,
      `Език на страницата: ${lang.toUpperCase()}`,
      ``,
      `Съобщение:`,
      message,
    ].join('\n');
    // base64 keeps the Cyrillic body 7-bit-safe for every receiving MTA
    msg.addMessage({
      contentType: 'text/plain',
      encoding: 'base64',
      data: Buffer.from(body, 'utf-8').toString('base64'),
    });

    await env.CONTACT_EMAIL.send(new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, msg.asRaw()));
    return redirect(`${prefix}/contact/sent`, 303);
  } catch (error) {
    console.error('Contact form send failed:', error);
    return redirect(`${prefix}/contact/error`, 303);
  }
};
