import type { APIRoute } from 'astro';
import { Buffer } from 'node:buffer';
import { createMimeMessage, Mailbox } from 'mimetext';

export const prerender = false;

const MAX_LENGTHS = { name: 200, email: 254, subject: 300, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(data: FormData, key: keyof typeof MAX_LENGTHS): string {
  const value = data.get(key);
  return typeof value === 'string' ? value.trim().slice(0, MAX_LENGTHS[key]) : '';
}

/** Only allow redirects back to a local contact page, never off-site. */
function safeRedirect(raw: FormDataEntryValue | null): string {
  return raw === '/en/contact' ? '/en/contact' : '/contact';
}

export const POST: APIRoute = async ({ request, redirect }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const wantsJson = request.headers.get('accept')?.includes('application/json');
  const redirectTo = safeRedirect(data.get('redirect'));

  const respond = (ok: boolean, status: number) => {
    if (wantsJson) {
      return new Response(JSON.stringify({ ok }), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return redirect(`${redirectTo}?sent=${ok ? '1' : '0'}`, 303);
  };

  // Honeypot: real users never fill this field. Pretend success for bots.
  if (typeof data.get('website') === 'string' && (data.get('website') as string).length > 0) {
    return respond(true, 200);
  }

  const name = field(data, 'name');
  const email = field(data, 'email');
  const subject = field(data, 'subject');
  const message = field(data, 'message');
  const lang = data.get('lang') === 'en' ? 'en' : 'bg';

  if (!name || !message || !EMAIL_RE.test(email)) {
    return respond(false, 400);
  }

  let env: CloudflareEnv | undefined;
  try {
    ({ env } = (await import('cloudflare:workers')) as unknown as { env: CloudflareEnv });
  } catch {
    // Not running in the Workers runtime (e.g. `astro dev` on Node).
  }
  const sender = env?.CONTACT_SENDER;
  const recipient = env?.CONTACT_RECIPIENT;
  const binding = env?.CONTACT_EMAIL;

  if (!binding || !sender || !recipient) {
    // Local development or missing configuration: log instead of sending.
    console.warn('[contact] CONTACT_EMAIL binding not configured; message not sent.', {
      name,
      email,
      subject,
    });
    return respond(import.meta.env.DEV, import.meta.env.DEV ? 200 : 500);
  }

  const mailSubject =
    subject.length > 0
      ? `[saprichastie.org] ${subject}`
      : lang === 'en'
        ? `[saprichastie.org] New message from ${name}`
        : `[saprichastie.org] Ново съобщение от ${name}`;

  const body = [
    lang === 'en' ? 'New message from the saprichastie.org contact form' : 'Ново съобщение от формата за контакт на saprichastie.org',
    '',
    `${lang === 'en' ? 'Name' : 'Име'}: ${name}`,
    `${lang === 'en' ? 'Email' : 'Имейл'}: ${email}`,
    subject ? `${lang === 'en' ? 'Subject' : 'Тема'}: ${subject}` : null,
    '',
    message,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  try {
    const msg = createMimeMessage();
    msg.setSender({ name: 'Saprichastie Website', addr: sender });
    msg.setRecipient(recipient);
    msg.setHeader('Reply-To', new Mailbox(email));
    msg.setSubject(mailSubject);
    // base64 keeps the Cyrillic body 7-bit-safe for every receiving MTA
    msg.addMessage({
      contentType: 'text/plain',
      encoding: 'base64',
      data: Buffer.from(body, 'utf-8').toString('base64'),
    });

    const { EmailMessage } = await import('cloudflare:email');
    await binding.send(new EmailMessage(sender, recipient, msg.asRaw()));
  } catch (err) {
    console.error('[contact] Failed to send email:', err);
    return respond(false, 500);
  }

  return respond(true, 200);
};
