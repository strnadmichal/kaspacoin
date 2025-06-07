'use client'

import React, { useEffect, useState, Fragment } from 'react'

// Importujeme komponenty pro sub-bloky
import { HeadingBlockComponent } from '../HeadingBlock/Component'
import { RichTextBlockComponent } from '../RichTextBlock/Component'
import { ImageBlockComponent } from '../ImageBlock/Component'

// Importujeme novou samostatnou Table of Contents komponentu
import { TableOfContents, type TocItem } from '../../components/TableOfContents' // Správná cesta
import type { Glossary } from '@/payload-types'

// Typy (budou generovány Payloadem, toto jsou zástupné)
interface HeadingData {
  blockType: 'headingBlock'
  id?: string // Unikátní ID pro TOC
  _id?: string // Payload ID bloku, můžeme použít pro generování unikátního klíče
  text: string
  level: 'h2' | 'h3' | 'h4'
}

interface RichTextData {
  blockType: 'richTextBlock'
  _id?: string
  richText: any
}

interface ImageData {
  blockType: 'imageBlock'
  _id?: string
  image: { url?: string | null; alt?: string | null; width?: number | null; height?: number | null }
  caption?: string | null
  size?: 'oneThird' | 'half' | 'twoThirds' | 'full'
}

type ArticleSection = HeadingData | RichTextData | ImageData // Union type pro všechny možné sekce

export interface StructuredArticleBlockProps {
  // Exportujeme, aby ji RenderBlocks mohl použít
  articleSections: ArticleSection[]
  enableTableOfContents?: boolean
  blockType: 'structuredArticle' // Důležité pro RenderBlocks
}

// Mapování slugů bloků na jejich komponenty
const sectionComponents = {
  headingBlock: HeadingBlockComponent,
  richTextBlock: RichTextBlockComponent,
  imageBlock: ImageBlockComponent,
  // Přidejte další, pokud máte více typů sekcí
}

// Utility funkce pro generování ID pro TOC, pokud není explicitně definováno
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // Nahradí mezery pomlčkami
    .replace(/[^\w-]+/g, '') // Odstraní speciální znaky
    .substring(0, 50) // Omezí délku
}

export const StructuredArticleComponent: React.FC<
  StructuredArticleBlockProps & { glossaryTerms?: Glossary[] }
> = ({ articleSections, enableTableOfContents, glossaryTerms }) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [sectionsWithIds, setSectionsWithIds] = useState<ArticleSection[]>([])

  useEffect(() => {
    const newTocItems: TocItem[] = []
    const newSectionsWithIds = articleSections.map((section, index) => {
      if (section.blockType === 'headingBlock') {
        const headingText = section.text || ''
        // Používáme _id z Payloadu pro větší unicitu, pokud je dostupné
        const uniqueId = section.id || `${generateSlug(headingText)}-${section._id || index}`

        newTocItems.push({
          id: uniqueId,
          text: headingText,
          level: parseInt(section.level.charAt(1)) - 1, // h2->1, h3->2, h4->3
        })
        return { ...section, id: uniqueId } // Přidáme/aktualizujeme ID přímo do dat sekce
      }
      return section
    })

    setTocItems(newTocItems)
    setSectionsWithIds(newSectionsWithIds)
  }, [articleSections])

  // Funkce pro scroll (stejná jako v ArticleContentComponent)
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 120 // Výška vašeho fixed/sticky headeru
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  if (!articleSections || articleSections.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
        {/* Table of Contents (pokud je povoleno a jsou položky) */}
        {enableTableOfContents && tocItems.length > 0 && (
          <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
            <TableOfContents items={tocItems} scrollToSection={scrollToSection} />
          </aside>
        )}

        {/* Mobilní Table of Contents (pokud je povoleno a jsou položky) */}
        {enableTableOfContents && tocItems.length > 0 && (
          <div className="lg:hidden mb-8">
            <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
              <summary className="p-4 cursor-pointer font-medium text-white hover:bg-white/5 transition-colors">
                Obsah článku ({tocItems.length} sekcí)
              </summary>
              <div className="p-4 pt-0">
                <nav>
                  <ul className="space-y-1">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`text-left text-sm transition-colors w-full py-2 px-3 rounded-md block text-gray-400 hover:text-white hover:bg-white/5 ${
                            // Úrovně v TocItem jsou 1 (H2), 2 (H3), 3 (H4)
                            item.level === 2
                              ? 'ml-4 text-xs'
                              : item.level === 3
                                ? 'ml-8 text-xs'
                                : ''
                          }`}
                        >
                          <span className="line-clamp-2">{item.text}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </details>
          </div>
        )}

        {/* Hlavní obsah - renderování jednotlivých sekcí */}
        <main className="min-w-0 space-y-6">
          {sectionsWithIds.map((section, index) => {
            const Component = sectionComponents[section.blockType]
            if (Component) {
              const key = section._id || `section-${index}`
              // Předáváme id prop pouze do HeadingBlockComponent, pokud byl vygenerován
              let componentProps: any =
                section.blockType === 'headingBlock' && section.id
                  ? { ...section, id: section.id }
                  : section
              if (glossaryTerms) {
                componentProps = { ...componentProps, glossaryTerms }
              }

              return <Component key={key} {...componentProps} />
            }
            return <div key={`unknown-${index}`}>Neznámý typ bloku: {section.blockType}</div>
          })}
        </main>
      </div>
    </div>
  )
}
