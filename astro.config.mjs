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
      i18n: {
        defaultLocale: 'bg',
        locales: { bg: 'bg', en: 'en' },
      },
    }),
  ],
});
