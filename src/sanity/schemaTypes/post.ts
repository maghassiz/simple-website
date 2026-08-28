import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL',
      description: 'Hosted on R2, not a Sanity asset — set by the import script.',
      type: 'url',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image alt text',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'e.g. "Hitels" or "News"',
      type: 'string',
    }),
    defineField({
      name: 'externalLink',
      title: 'External / CTA link',
      type: 'string',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
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
                fields: [{ name: 'href', type: 'string', title: 'URL (absolute or relative path)' }],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 2,
    }),
  ],
})
