import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['question', 'category', 'isPublished', 'order'],
    useAsTitle: 'question',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures]
        },
      }),
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'faq-categories',
      required: true,
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Zrušte zaškrtnutí pro skrytí otázky',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Číslo pro řazení (nižší číslo = výše v seznamu)',
      },
    },
  ],
  versions: {
    drafts: true,
  },
}
