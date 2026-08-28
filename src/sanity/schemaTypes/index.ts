import type { SchemaTypeDefinition } from 'sanity'

import post from './post'
import faq from './faq'
import testimonial from './testimonial'
import story from './story'
import storiesClosingCard from './storiesClosingCard'

export const schemaTypes: SchemaTypeDefinition[] = [post, faq, testimonial, story, storiesClosingCard]
