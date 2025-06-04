import React from 'react'

// Předpokládáme, že payload-types.ts bude regenerován a bude obsahovat HeadingBlock typ
// Prozatím můžeme použít obecnější typ nebo si ho zde nadefinovat
interface HeadingBlockProps {
  text: string
  level: 'h2' | 'h3' | 'h4'
  blockType: 'headingBlock' // Důležité pro RenderBlocks
  id?: string // Přidáno pro TOC, pokud by se ID generovalo zde
}

export const HeadingBlockComponent: React.FC<HeadingBlockProps> = ({ text, level, id }) => {
  const Tag = level // h2, h3, nebo h4

  // ID pro TOC by mělo být generováno v rodičovské komponentě (StructuredArticleComponent)
  // a předáno sem, nebo by tato komponenta mohla přijímat unikátní prefix
  // Prozatím ho necháme jako volitelný prop.
  return (
    <Tag id={id} className="scroll-mt-24"> {/* scroll-mt-24 pro offset fixed/sticky headeru */}
      {text}
    </Tag>
  )
} 