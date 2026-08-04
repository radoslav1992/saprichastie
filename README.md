# Съпричастие – Пазарджик / Saprichastie – Pazardzhik

Официалният уебсайт на Фондация „Съпричастие – Пазарджик“ — подкрепа за хора със
зрителни увреждания.

Built with [Astro](https://astro.build) and deployed as a
[Cloudflare Worker](https://developers.cloudflare.com/workers/) with static assets.

## Features

- **Bilingual** — Bulgarian (default, `/`) and English (`/en/`), with proper
  `hreflang` alternates and a localized sitemap.
- **Accessibility-first** — skip link, keyboard-friendly navigation, visible
  focus states, high-contrast mode, adjustable text size, read-page-aloud
  (speech synthesis), semantic landmarks, `prefers-reduced-motion` support.
- **Contact form** — served by a Worker endpoint (`/api/contact`) that sends
  email through Cloudflare's [Send Email binding](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/),
  so submissions land in a mailbox of your choice via Email Routing. Includes a
  honeypot field for spam and works without JavaScript.
- **Static-first** — every page is prerendered at build time; only the contact
  endpoint runs on-demand in the Worker.

## Development

```sh
npm install
npm run dev        # dev server at http://localhost:4321
npm run build      # build to ./dist
npm run preview    # build + run locally with wrangler (Workers runtime)
```

In local dev the contact form does not send real email — submissions are logged
to the console and reported as successful.

## Deployment (Cloudflare Workers)

```sh
npx wrangler login
npm run deploy
```

The Worker is configured in `wrangler.jsonc`. The build writes a resolved
config to `dist/server/wrangler.json` and points `wrangler deploy` at it
automatically (via `.wrangler/deploy/config.json`), so a plain
`npm run deploy` is all that's needed. The `SESSION` KV namespace used by
Astro sessions is provisioned automatically on first deploy.

### Custom domain

After the first deploy, add your domain (e.g. `saprichastie.org`) to the Worker
under **Workers & Pages → saprichastie → Settings → Domains & Routes**.

## Contact form → Email Routing setup

The form posts to `/api/contact`, which sends an email using the `send_email`
binding. One-time setup in the Cloudflare dashboard:

1. **Enable Email Routing** for your domain
   (**Email → Email Routing** on the zone). Add the DNS records it asks for.
2. **Verify the destination mailbox** — under **Destination addresses**, add the
   personal/organization mailbox that should receive submissions and confirm
   the verification email.
3. **Configure the addresses** in `wrangler.jsonc`:
   - `CONTACT_SENDER` — the "from" address; must be on your Email-Routing
     domain (e.g. `contact@saprichastie.org`).
   - `CONTACT_RECIPIENT` — where submissions go. Either a verified destination
     address directly, or an address on your domain (e.g.
     `info@saprichastie.org`) with a routing rule that forwards it to your
     mailbox.
4. Deploy again. That's it — no SMTP credentials or third-party services.

Optionally restrict the binding in `wrangler.jsonc` so the Worker can only ever
email you:

```jsonc
"send_email": [
  {
    "name": "CONTACT_EMAIL",
    "allowed_destination_addresses": ["you@example.com"]
  }
]
```

## Project structure

```
src/
  components/        # Header, Footer, Icon, PageHeader
    pages/           # Full page content, parameterized by language
  data/gallery.ts    # Gallery images + localized alt text
  i18n/index.ts      # All translations (bg/en) and URL helpers
  layouts/Base.astro # HTML shell, SEO tags, a11y preferences bootstrap
  pages/             # Routes: bg at /, en at /en/, /api/contact endpoint
  styles/global.css  # Design tokens, high-contrast theme, utilities
public/images/       # Logo + optimized gallery photos
```

## Updating the gallery

Add photos to `public/images/gallery/` and register them in
`src/data/gallery.ts` with width/height and Bulgarian + English alt text. The
first four entries also appear on the home page.
