// @ts-check
import { loadEnv } from 'vite';
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';

// astro.config.mjs loads before Astro's own .env loading, so read it manually here
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    sanity({
      projectId: env.PUBLIC_SANITY_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_DATASET || 'production',
      useCdn: true,
      studioBasePath: '/studio',
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
    }
  }
});