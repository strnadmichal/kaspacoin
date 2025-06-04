import type { Block } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  ChecklistFeature,
  // Poznámka: Nezahrnujeme HeadingFeature, protože nadpisy budou řešeny samostatným HeadingBlockem
} from '@payloadcms/richtext-lexical'

export const RichTextBlock: Block = {
  slug: 'richTextBlock',
  interfaceName: 'RichTextBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      label: 'Formátovaný text',
      editor: lexicalEditor({
        features: ({
          // defaultFeatures,
          rootFeatures
        }) => [
          ...rootFeatures, // Základní prvky jako odstavce, zalamování řádků
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          StrikethroughFeature(),
          LinkFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          ChecklistFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
} 