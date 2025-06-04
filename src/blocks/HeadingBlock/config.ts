import type { Block } from 'payload'

export const HeadingBlock: Block = {
  slug: 'headingBlock',
  interfaceName: 'HeadingBlock',
  fields: [
    {
      name: 'text',
      type: 'text',
      label: 'Text nadpisu',
      required: true,
    },
    {
      name: 'level',
      type: 'select',
      label: 'Úroveň nadpisu',
      required: true,
      options: [
        {
          label: 'H2 (Hlavní sekce)',
          value: 'h2',
        },
        {
          label: 'H3 (Podsekce)',
          value: 'h3',
        },
        {
          label: 'H4 (Menší podsekce)',
          value: 'h4',
        },
      ],
      defaultValue: 'h2',
    },
  ],
} 