// One-off seed for the story-viewer's closing "bumper" slide — not derived
// from a CSV (no Stories.csv row backs it), so it lives here instead of
// import.mjs. Safe to re-run: createOrReplace against a fixed _id.
//
// Usage: node --env-file=.env scripts/framer-import/seed-stories-closing-card.mjs

import { createClient } from '@sanity/client';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name} (run with --env-file=.env)`);
  return value;
}

const client = createClient({
  projectId: requireEnv('PUBLIC_SANITY_PROJECT_ID'),
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  token: requireEnv('SANITY_API_TOKEN'),
  apiVersion: '2024-01-01',
  useCdn: false,
});

const R2_BASE = requireEnv('R2_PUBLIC_URL');
const icon = (name) => `${R2_BASE}/images/home/stories/${name}`;

const doc = {
  _id: 'storiesClosingCard-default',
  _type: 'storiesClosingCard',
  heading: 'Turn website visitors into direct bookings',
  backgroundImageUrl: `${R2_BASE}/cms/stories/hitels-bg.webp`,
  backgroundImageAlt: '',
  features: [
    { _key: 'user-ai', iconUrl: icon('icon-user-ai.svg'), text: 'Access to hotel web experts' },
    { _key: 'framer', iconUrl: icon('icon-framer.svg'), text: 'Framer Agency Partners' },
    { _key: 'calendar-add', iconUrl: icon('icon-calendar-add.svg'), text: 'Focus on direct booking' },
    { _key: 'brush', iconUrl: icon('icon-brush.svg'), text: 'Exceptional custom look and feel' },
    { _key: 'globe', iconUrl: icon('icon-globe.svg'), text: 'World class service' },
  ],
  buttonText: 'Get a quote',
  buttonLink: '/contact-us',
};

await client.createOrReplace(doc);
console.log('✓ storiesClosingCard-default seeded');
