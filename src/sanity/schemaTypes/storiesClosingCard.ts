import { defineField, defineType } from 'sanity'

// Singleton: the fixed closing "bumper" slide shown after all customer
// stories in the Instagram-style story viewer (Hero section, mobile). Not
// backed by a Stories.csv row — it's evergreen CTA copy, not a case study.
export default defineType({
  name: 'storiesClosingCard',
  title: 'Stories: Closing Card',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'backgroundImageUrl',
      title: 'Background image URL',
      description: 'Hosted on R2, not a Sanity asset.',
      type: 'url',
    }),
    defineField({
      name: 'backgroundImageAlt',
      title: 'Background image alt text',
      type: 'string',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'feature',
          fields: [
            { name: 'iconUrl', title: 'Icon URL', type: 'url' },
            { name: 'text', title: 'Text', type: 'string' },
          ],
          preview: { select: { title: 'text' } },
        },
      ],
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
})
