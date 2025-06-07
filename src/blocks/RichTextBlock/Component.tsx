import React from 'react'
import RichText from '@/components/RichText' // Použijeme náš vlastní RichText wrapper
import type { Glossary } from '@/payload-types'
import { GlossaryRichText } from '@/components/GlossaryRichText'

// Typ pro props, měl by odpovídat struktuře RichTextBlock z payload-types.ts
interface RichTextBlockProps {
  richText: any // Lexical editor data
  blockType: 'richTextBlock'
  glossaryTerms?: Glossary[]
}

export const RichTextBlockComponent: React.FC<RichTextBlockProps> = ({
  richText,
  glossaryTerms,
}) => {
  if (!richText) {
    return null
  }

  return glossaryTerms ? (
    <GlossaryRichText content={richText} glossaryTerms={glossaryTerms} />
  ) : (
    <RichText data={richText} />
  )
}
