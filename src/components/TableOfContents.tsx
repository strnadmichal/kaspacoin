'use client'

import React, { useEffect, useState } from 'react'

export interface TocItem {
  id: string
  text: string
  level: number // 1 (h2), 2 (h3), 3 (h4) - pro odsazení v TOC
}

interface TableOfContentsProps {
  items: TocItem[]
  scrollToSection: (id: string) => void
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items, scrollToSection }) => {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -50% 0px', // Upravte podle výšky vašeho headeru a preferencí
        threshold: 0.1,
      },
    )

    // Pozorujeme pouze elementy, které mají ID odpovídající položkám v TOC
    items.forEach((item) => {
      const headingElement = document.getElementById(item.id)
      if (headingElement) {
        observer.observe(headingElement)
      }
    })

    return () => {
      items.forEach((item) => {
        const headingElement = document.getElementById(item.id)
        if (headingElement) {
          observer.unobserve(headingElement)
        }
      })
      observer.disconnect()
    }
  }, [items]) // Závislost na items, aby se observer aktualizoval při jejich změně

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
                  // Úrovně jsou 1, 2, 3 pro H2, H3, H4
                  item.level === 2 ? 'ml-4 text-xs' : item.level === 3 ? 'ml-8 text-xs' : ''
                }`}
              >
                <span className="line-clamp-2">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Progress indicator */}
      {items.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="text-xs text-gray-500 mb-2">Průběh čtení</div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal transition-all duration-300 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  ((items.findIndex((i) => i.id === activeId) + 1) / items.length) * 100,
                )}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
