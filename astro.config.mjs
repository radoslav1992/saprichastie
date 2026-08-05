// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://saprichastie.org',
  output: 'static',
  adapter: cloudflare({
    imageService: 'compile',
    // The root wrangler.jsonc declares the *built* Worker (main/assets) so a
    // bare `npx wrangler deploy` works in CI; the adapter must not read it
    // before those files exist. It gets its own config instead.
    configPath: 'wrangler.build.jsonc',
  }),
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'bg',
        locales: {
          bg: 'bg-BG',
          en: 'en-US',
        },
      },
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  i18n: {
    defaultLocale: 'bg',
    locales: ['bg', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
