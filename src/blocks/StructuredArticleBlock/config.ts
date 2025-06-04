import type { Block } from 'payload'
import { HeadingBlock } from '../HeadingBlock/config'
import { RichTextBlock } from '../RichTextBlock/config'
import { ImageBlock } from '../ImageBlock/config'
// Importujte další bloky, které chcete povolit uvnitř článku

export const StructuredArticleBlock: Block = {
  slug: 'structuredArticle',
  interfaceName: 'StructuredArticleBlock',
  fields: [
    {
      name: 'articleSections',
      label: 'Sekce článku',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [
        HeadingBlock,    // Povolíme vkládání nadpisů
        RichTextBlock,   // Povolíme vkládání formátovaného textu
        ImageBlock,      // Povolíme vkládání obrázků
        // Zde můžete přidat další povolené bloky
      ],
    },
    {
      name: 'enableTableOfContents',
      type: 'checkbox',
      label: 'Povolit obsahový seznam (Table of Contents)',
      defaultValue: true,
    },
    // Můžeme přidat další pole specifická pro celý článek, pokud je třeba
    // např. {
    //   name: 'author',
    //   type: 'relationship',
    //   relationTo: 'users',
    // }
  ],
} 