import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

export const Merchants: CollectionConfig = {
  slug: 'merchants',
  admin: {
    useAsTitle: 'name',
    description: 'Seznam obchodníků a podniků, které přijímají Kaspa.',
    defaultColumns: ['name', 'website', 'isPublished', 'updatedAt'],
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      label: 'Název obchodníka',
      type: 'text',
      required: true,
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      label: 'Zveřejněno',
      admin: {
        position: 'sidebar',
      },
      defaultValue: false,
    },
    ...slugField('name'),
    {
      name: 'description',
      label: 'Krátký popis',
      type: 'textarea',
      required: true,
    },
    {
      name: 'website',
      label: 'Webová stránka',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'categories',
      label: 'Kategorie',
      type: 'relationship',
      relationTo: 'merchant-categories',
      hasMany: true,
      required: true,
    },
    {
      name: 'address',
      label: 'Adresa (volitelné)',
      type: 'group',
      fields: [
        {
          name: 'street',
          label: 'Ulice a č.p.',
          type: 'text' as const,
        },
        {
          name: 'city',
          label: 'Město',
          type: 'text' as const,
        },
        {
          name: 'zip',
          label: 'PSČ',
          type: 'text' as const,
        },
      ],
    },
  ],
  timestamps: true,
}
