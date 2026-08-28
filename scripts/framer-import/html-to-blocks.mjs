// Converts the Framer CMS export's rich-text HTML into Sanity Portable Text
// blocks, so blog bodies get a proper rich-text editing experience in Studio
// instead of a raw-HTML field.

import { JSDOM } from 'jsdom';
import { htmlToBlocks } from '@portabletext/block-tools';
import { Schema } from '@sanity/schema';

const compiledSchema = Schema.compile({
  name: 'framerImport',
  types: [
    {
      type: 'document',
      name: 'post',
      fields: [
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [
            {
              type: 'block',
              marks: {
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{ name: 'href', type: 'string', title: 'URL' }],
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
});

const blockContentType = compiledSchema.get('post').fields.find((field) => field.name === 'body').type;

export function htmlToPortableText(html) {
  if (!html) return [];
  return htmlToBlocks(html, blockContentType, {
    parseHtml: (input) => new JSDOM(input).window.document,
  });
}
