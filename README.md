# Съпричастие — Пазарджик / Saprichastie — Pazardzhik

Website of Foundation "Saprichastie — Pazardzhik", supporting people with
visual impairments. Built with [Astro](https://astro.build) and deployed as a
[Cloudflare Worker](https://developers.cloudflare.com/workers/).

## Pages

Bilingual, Bulgarian first — every page exists at `/…` (BG) and `/en/…` (EN):

| BG | EN | Page |
| --- | --- | --- |
| `/` | `/en/` | Home |
| `/about` | `/en/about` | About us |
| `/services` | `/en/services` | Services |
| `/activities` | `/en/activities` | Activities |
| `/gallery` | `/en/gallery` | Gallery |
| `/contact` | `/en/contact` | Contact + form |

All copy lives in `src/i18n/bg.ts` and `src/i18n/en.ts` — edit those files to
change any text on the site.

## Accessibility

The site targets WCAG and ships a visitor-facing accessibility panel
(the "Достъпност" button in the header):

- text size steps (100 / 115 / 135 / 160 %),
- high-contrast mode (yellow on black),
- wider letter & line spacing,
- underlined links,
- per-section read-aloud (Web Speech API) with BG/EN voices.

Preferences persist in `localStorage` and are applied before first paint.

## Development

```sh
npm install
npm run dev        # local dev server (astro dev)
npm run build      # production build into dist/
npm run preview    # run the built worker locally with wrangler
```

Note: the contact form can only actually send email when deployed to
Cloudflare (the `send_email` binding does not exist locally); locally a
submission lands on the error page.

## Deployment (Cloudflare Worker)

```sh
npm run deploy     # astro build && wrangler deploy
```

Configuration lives in `wrangler.jsonc`. The static build is served from the
`dist/` assets directory; only `POST /api/contact` runs in the Worker.

### Contact form → Email Routing setup (one-time)

The contact form sends submissions as email through
[Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/):

1. In the Cloudflare dashboard for the `saprichastie.org` zone, enable
   **Email → Email Routing**.
2. Add and verify the destination mailbox (where you want to receive the
   messages) under **Destination addresses**.
3. Make sure `wrangler.jsonc` matches:
   - `CONTACT_TO` — the verified destination mailbox;
   - `CONTACT_FROM` — any address on `saprichastie.org` (it is the sender of
     the notification mails; it does not need to exist as a mailbox).
4. Deploy. Form submissions arrive at `CONTACT_TO`, with the visitor's
   address in `Reply-To`, so you can reply directly from your mail client.

To route to a different mailbox later, change `CONTACT_TO` (and verify the
new address in Email Routing), then redeploy.

## Gallery

Photos live in `src/assets/photos/` and are listed (with captions in both
languages) in the `gallery.items` arrays in `src/i18n/bg.ts` /
`src/i18n/en.ts`. To add a photo: drop the file into `src/assets/photos/`,
import it and add it to the `photos` map in
`src/components/pages/GalleryPage.astro`, and add a caption entry per
language.
