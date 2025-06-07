import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'

export const GlossaryCategories: CollectionConfig = {
  slug: 'glossary-categories',
  admin: {
    useAsTitle: 'title',
    description: 'Kategorie pro pojmy ve slovníku.',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Název kategorie',
      type: 'text',
      required: true,
    },
    ...slugField(),
  ],
  timestamps: true,
}
