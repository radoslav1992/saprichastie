// @ts-check
import { defineConfig, sharpImageService } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://saprichastie.org',
  output: 'static',
  adapter: cloudflare({
    // 'custom' keeps the adapter's hands off the image config below
    imageService: 'custom',
  }),
  image: {
    // sharp optimizes images on prerendered pages at build time; on
    // server-rendered pages the endpoint below serves the originals via
    // the ASSETS binding (a Worker cannot fetch its own hostname).
    service: sharpImageService(),
    endpoint: { route: '/_image', entrypoint: './src/image-endpoint.ts' },
  },
  integrations: [
    sitemap({
      // keep utility pages (form results, 404) out of search results
      filter: (page) => !/\/contact\/(sent|error)\/$|\/404\/?$/.test(page),
      // server-rendered pages (admin-managed gallery, live library) are
      // invisible to the sitemap integration's static-build discovery
      customPages: [
        'https://saprichastie.org/gallery/',
        'https://saprichastie.org/en/gallery/',
        'https://saprichastie.org/library/',
        'https://saprichastie.org/en/library/',
      ],
      i18n: {
        defaultLocale: 'bg',
        locales: { bg: 'bg', en: 'en' },
      },
    }),
  ],
});
