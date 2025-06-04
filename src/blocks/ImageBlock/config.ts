import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'imageBlock',
  interfaceName: 'ImageBlock',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media', // Musí odpovídat slugu vaší Media collection
      label: 'Obrázek',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Popisek obrázku',
    },
    {
      name: 'size',
      type: 'select',
      label: 'Velikost obrázku v článku',
      options: [
        {
          label: 'Malý (šířka 33%)',
          value: 'oneThird',
        },
        {
          label: 'Střední (šířka 50%)',
          value: 'half',
        },
        {
          label: 'Velký (šířka 66%)',
          value: 'twoThirds',
        },
        {
          label: 'Plná šířka obsahu',
          value: 'full',
        },
      ],
      defaultValue: 'full',
    },
  ],
} 