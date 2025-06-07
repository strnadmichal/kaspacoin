import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'

export const MerchantCategories: CollectionConfig = {
  slug: 'merchant-categories',
  admin: {
    useAsTitle: 'title',
    description: 'Kategorie pro obchodníky (např. E-shopy, Služby, Kavárny).',
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
