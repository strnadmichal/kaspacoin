import type { CollectionConfig } from 'payload'

export const SourceCategories: CollectionConfig = {
  slug: 'source-categories',
  admin: {
    useAsTitle: 'name',
    description: 'Kategorie pro zdroje v ekosystému.',
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
    {
      name: 'description',
      label: 'Popis kategorie',
      type: 'textarea',
    },
  ],
  timestamps: true,
}
