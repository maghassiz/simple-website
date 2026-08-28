// @ts-check
import { loadEnv } from 'vite';
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import sitemap from '@astrojs/sitemap';

// astro.config.mjs loads before Astro's own .env loading, so read it manually here
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// Placeholder until a custom domain is attached — swap via PUBLIC_SITE_URL env var,
// no code change needed. Drives canonical URLs, sitemap, and OG/Twitter tags.
const SITE_URL = env.PUBLIC_SITE_URL || 'https://simple-website-khaki-three.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

  integrations: [
    react(),
    sanity({
      projectId: env.PUBLIC_SANITY_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_DATASET || 'production',
      useCdn: true,
      studioBasePath: '/studio',
    }),
    sitemap({
      filter: (page) => !page.includes('/studio'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  env: {
    schema: {
      PUBLIC_SANITY_PROJECT_ID: envField.string({ context: 'client', access: 'public' }),
      PUBLIC_SANITY_DATASET: envField.string({ context: 'client', access: 'public', default: 'production' }),
      R2_PUBLIC_URL: envField.string({ context: 'client', access: 'public' }),
      PUBLIC_CONTACT_FORM_ENDPOINT: envField.string({ context: 'client', access: 'public', default: '' }),
    }
  }
});