import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react' // Použijeme existující RichText komponentu od Payloadu

// Typ pro props, měl by odpovídat struktuře RichTextBlock z payload-types.ts
interface RichTextBlockProps {
  richText: any // Lexical editor data
  blockType: 'richTextBlock'
}

export const RichTextBlockComponent: React.FC<RichTextBlockProps> = ({ richText }) => {
  if (!richText) {
    return null
  }

  return (
    <div className="prose prose-invert prose-lg max-w-none">
      {/* 
        Renderujeme richText data pomocí Payload RichText komponenty.
        Třídy "prose" zajišťují základní typografické styly pro text z editoru.
        max-w-none odstraní výchozí omezení šířky prose, pokud chceme plnou šířku kontejneru.
      */}
      <RichText data={richText} />
    </div>
  )
} 