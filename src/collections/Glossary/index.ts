import type { CollectionConfig } from 'payload'
import { slugField } from '../../fields/slug'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Glossary: CollectionConfig = {
  slug: 'glossary',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['term', 'isPublished', 'updatedAt'],
    useAsTitle: 'term',
  },
  fields: [
    {
      name: 'term',
      type: 'text',
      required: true,
      label: 'Pojem',
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Krátký souhrn',
      admin: {
        description:
          'Krátký, jedno-dvěvětný popis pojmu, který se zobrazí v seznamu na hlavní stránce slovníku.',
      },
    },
    {
      name: 'definition',
      type: 'richText',
      required: true,
      label: 'Definice',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures]
        },
      }),
    },
    ...slugField('term'),
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      label: 'Zveřejněno',
      admin: {
        position: 'sidebar',
        description: 'Zrušte zaškrtnutí pro skrytí pojmu z veřejného webu.',
      },
    },
  ],
  versions: {
    drafts: true,
  },
}
