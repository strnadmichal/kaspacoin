import type { CollectionConfig } from 'payload/types'

export const FAQCategories: CollectionConfig = {
  slug: 'faq-categories',
  admin: {
    useAsTitle: 'name',
    description: 'Kategorie pro často kladené dotazy.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Název kategorie',
      type: 'text',
      required: true,
    },
  ],
  timestamps: true,
}
