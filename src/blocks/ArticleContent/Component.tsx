'use client'

import React, { useEffect, useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface ArticleContentBlockType {
  content: any
  enableTableOfContents?: boolean
  blockType: 'articleContent'
}

// Přesunul jsem scrollToSection ven jako utility funkci
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const headerOffset = 120
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const TableOfContents: React.FC<{ items: TableOfContentsItem[] }> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { 
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0.1 
      }
    )

    const headings = document.querySelectorAll('h2, h3, h4')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  if (items.length === 0) return null

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="font-medium text-lg mb-4 text-white">Obsah</h3>
      <nav>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-sm transition-all duration-200 w-full py-2 px-3 rounded-md block ${
                  activeId === item.id
                    ? 'text-teal bg-teal/10 border-l-2 border-teal font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                } ${
                  item.level === 3 ? 'ml-4 text-xs' : item.level === 4 ? 'ml-8 text-xs' : ''
                }`}
              >
                <span className="line-clamp-2">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="text-xs text-gray-500 mb-2">Průběh čtení</div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal transition-all duration-300 rounded-full"
            style={{
              width: `${Math.min(100, (items.findIndex(item => item.id === activeId) + 1) / items.length * 100)}%`
            }}
          />
        </div>
      </div>
    </div>
  )
}

export const ArticleContentComponent: React.FC<ArticleContentBlockType> = ({
  content,
  enableTableOfContents,
}) => {
  const [tocItems, setTocItems] = useState<TableOfContentsItem[]>([])

  useEffect(() => {
    if (!enableTableOfContents) return

    const timer = setTimeout(() => {
      const headings = document.querySelectorAll('.prose h2, .prose h3, .prose h4')
      const items: TableOfContentsItem[] = []
      headings.forEach((heading, index) => {
        const text = heading.textContent || ''
        const level = parseInt(heading.tagName.charAt(1))
        const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50)}`
        heading.id = id
        heading.classList.add('scroll-mt-32')
        items.push({ id, text, level })
      })
      setTocItems(items)
    }, 200)

    return () => clearTimeout(timer)
  }, [content, enableTableOfContents])

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
        {enableTableOfContents && tocItems.length > 0 && (
          <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
            <TableOfContents items={tocItems} />
          </aside>
        )}
        
        {/* Mobilní Table of Contents */}
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
                            item.level === 3 ? 'ml-4 text-xs' : item.level === 4 ? 'ml-8 text-xs' : ''
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
        
        <main className="min-w-0">
          <div className="prose prose-invert prose-lg max-w-none">
            <RichText data={content} />
          </div>
        </main>
      </div>
    </div>
  )
} 