import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ArticleContent: Block = {
  slug: 'articleContent',
  interfaceName: 'ArticleContentBlock',
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Obsah článku',
      required: true,
    },
    {
      name: 'enableTableOfContents',
      type: 'checkbox',
      label: 'Povolit obsahový seznam',
      defaultValue: true,
    },
  ],
} 