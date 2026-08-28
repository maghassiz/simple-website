// One-time import of the Framer CMS CSV export (Blog, FAQ, Testimonial, Stories)
// into Sanity. Images are mirrored to R2 (not uploaded as Sanity assets) and
// referenced by plain URL, matching this project's chosen asset architecture.
//
// Usage:
//   node --env-file=.env scripts/framer-import/import.mjs [blog|faq|testimonial|stories]
//   (omit the argument to import all four)
//
// Requires SANITY_API_TOKEN in .env — a token with "Editor" or "Write"
// permissions, created at https://sanity.io/manage under your project's API tab.
// Safe to re-run: documents are createOrReplace'd by a deterministic _id
// derived from the CSV slug, so re-running just updates existing content.

import { readFile } from 'node:fs/promises';
import { createClient } from '@sanity/client';
import { parse } from 'csv-parse/sync';
import { mirrorImageToR2 } from './r2.mjs';
import { htmlToPortableText } from './html-to-blocks.mjs';

const DATA_DIR = new URL('./data/', import.meta.url);

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name} (run with --env-file=.env)`);
  return value;
}

// Sanity document IDs only allow [a-z0-9_.-] — the CSV slugs include accented
// characters (e.g. "karítas-k-mccrann"), so strip diacritics for the _id
// while leaving the human-readable `slug` field untouched.
function slugify(slug) {
  return slug
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, '-');
}

function toDocId(prefix, slug) {
  return `${prefix}-${slugify(slug)}`;
}

const client = createClient({
  projectId: requireEnv('PUBLIC_SANITY_PROJECT_ID'),
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  token: requireEnv('SANITY_API_TOKEN'),
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function readCsv(filename) {
  const content = await readFile(new URL(filename, DATA_DIR), 'utf-8');
  return parse(content, { columns: true });
}

async function importBlog() {
  const rows = await readCsv('Blog.csv');
  console.log(`Importing ${rows.length} blog posts...`);

  for (const row of rows) {
    const slug = row.Slug.trim();
    const imageUrl = await mirrorImageToR2(row.Image, 'cms/blog', slugify(slug));

    const doc = {
      _id: toDocId('post', slug),
      _type: 'post',
      title: row.Title,
      slug: { current: slug },
      imageUrl: imageUrl ?? undefined,
      imageAlt: row['Image:alt'] || undefined,
      publishedAt: row.Date || undefined,
      category: row.Type || undefined,
      externalLink: row.Link || undefined,
      shortDescription: row['Short Desc'] || undefined,
      body: htmlToPortableText(row['Content Body 1']),
      metaTitle: row['Meta Title'] || undefined,
      metaDescription: row['Meta Description'] || undefined,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${slug}`);
  }
}

async function importFaq() {
  const rows = await readCsv('FAQ.csv');
  console.log(`Importing ${rows.length} FAQs...`);

  for (const [index, row] of rows.entries()) {
    const slug = row.Slug.trim();
    const doc = {
      _id: toDocId('faq', slug),
      _type: 'faq',
      question: row.Question,
      answer: row.Answer,
      order: index,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${slug}`);
  }
}

async function importTestimonial() {
  const rows = await readCsv('Testimonial.csv');
  console.log(`Importing ${rows.length} testimonials...`);

  for (const row of rows) {
    const slug = row.Slug.trim();
    const imageUrl = await mirrorImageToR2(row.Image, 'cms/testimonials', slugify(slug));

    const doc = {
      _id: toDocId('testimonial', slug),
      _type: 'testimonial',
      name: row.Name,
      role: row.Role || undefined,
      quote: row.Testimonial,
      imageUrl: imageUrl ?? undefined,
      imageAlt: row['Image:alt'] || undefined,
      order: Number(row.Order) || 0,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${slug}`);
  }
}

async function importStories() {
  const rows = await readCsv('Stories.csv');
  console.log(`Importing ${rows.length} stories...`);

  for (const row of rows) {
    const slug = row.Slug.trim();
    const backgroundImageUrl = await mirrorImageToR2(row['Background Image'], 'cms/stories', `${slugify(slug)}-bg`);
    const websitePreviewUrl = await mirrorImageToR2(row['Website Preview'], 'cms/stories', `${slugify(slug)}-preview`);

    const doc = {
      _id: toDocId('story', slug),
      _type: 'story',
      projectName: row['Project Name'],
      slug: { current: slug },
      order: Number(row.Order) || 0,
      storyTitle: row['Story Title (If needed)'] || undefined,
      description: row['Story Description'] || undefined,
      backgroundImageUrl: backgroundImageUrl ?? undefined,
      backgroundImageAlt: row['Background Image:alt'] || undefined,
      websitePreviewUrl: websitePreviewUrl ?? undefined,
      websitePreviewAlt: row['Website Preview:alt'] || undefined,
      buttonText: row['Button Text'] || undefined,
      buttonLink: row['Button Link'] || undefined,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${slug}`);
  }
}

const IMPORTERS = { blog: importBlog, faq: importFaq, testimonial: importTestimonial, stories: importStories };

const target = process.argv[2];

if (target && !IMPORTERS[target]) {
  console.error(`Unknown target "${target}". Expected one of: ${Object.keys(IMPORTERS).join(', ')}`);
  process.exit(1);
}

for (const [name, run] of Object.entries(IMPORTERS)) {
  if (target && target !== name) continue;
  await run();
}

console.log('Done.');
