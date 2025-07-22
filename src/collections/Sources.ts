import type { CollectionConfig } from 'payload'

export const Sources: CollectionConfig = {
  slug: 'sources',
  admin: {
    useAsTitle: 'name',
    description: 'Zdroje a projekty v ekosystému Kaspa.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Název zdroje',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Popis',
      type: 'textarea',
      required: true,
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      label: 'Kategorie',
      type: 'relationship',
      relationTo: 'source-categories',
      required: true,
    },
    {
      name: 'tags',
      label: 'Štítky',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    // Maybe add logo later
  ],
  timestamps: true,
}
