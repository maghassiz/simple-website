import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'story',
  title: 'Customer Story',
  type: 'document',
  fields: [
    defineField({
      name: 'projectName',
      title: 'Project name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'projectName' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
    defineField({
      name: 'storyTitle',
      title: 'Story title (intro cards only)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'backgroundImageUrl',
      title: 'Background image URL',
      description: 'Hosted on R2, not a Sanity asset — set by the import script.',
      type: 'url',
    }),
    defineField({
      name: 'backgroundImageAlt',
      title: 'Background image alt text',
      type: 'string',
    }),
    defineField({
      name: 'websitePreviewUrl',
      title: 'Website preview image URL',
      description: 'Hosted on R2, not a Sanity asset — set by the import script.',
      type: 'url',
    }),
    defineField({
      name: 'websitePreviewAlt',
      title: 'Website preview image alt text',
      type: 'string',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button text',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button link (absolute or relative path)',
      type: 'string',
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
