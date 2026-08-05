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
  }),
  integrations: [
    sitemap({
      // keep utility pages (form results, 404) out of search results
      filter: (page) => !/\/contact\/(sent|error)\/$|\/404\/?$/.test(page),
      i18n: {
        defaultLocale: 'bg',
        locales: { bg: 'bg', en: 'en' },
      },
    }),
  ],
});
