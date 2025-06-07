'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Category, Glossary } from '@/payload-types'

export function GlossaryList({ initialItems }: { initialItems: Glossary[] }) {
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  useEffect(() => {
    const categories = initialItems
      .flatMap((item) => item.categories || [])
      .filter((cat): cat is Category => typeof cat === 'object' && cat !== null && 'id' in cat)
      .filter((cat, index, self) => self.findIndex((c) => c.id === cat.id) === index)

    setAllCategories(categories)
  }, [initialItems])

  const filteredItems = activeCategory
    ? initialItems.filter((item) =>
        item.categories?.some((cat) => typeof cat === 'object' && cat.id === activeCategory),
      )
    : initialItems

  if (!initialItems) {
    return <div>Načítání...</div>
  }

  const groupedItems = filteredItems.reduce<Record<string, Glossary[]>>((acc, item) => {
    if (!item.term) return acc // Skip items without a term
    const firstLetter = item.term.charAt(0).toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(item)
    return acc
  }, {})

  const alphabet = Object.keys(groupedItems).sort()

  return (
    <>
      {/* Category Filter */}
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === null
              ? 'bg-teal text-black'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          Všechny
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-teal text-black'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-8 space-x-2">
        {alphabet.map((letter) => (
          <a
            href={`#${letter}`}
            key={letter}
            className="text-teal hover:text-white font-bold text-lg"
          >
            {letter}
          </a>
        ))}
      </div>

      <div>
        {alphabet.map((letter) => (
          <div key={letter} id={letter} className="pt-8">
            <h2 className="text-3xl font-bold text-teal mb-4 border-b border-gray-700 pb-2">
              {letter}
            </h2>
            <ul>
              {groupedItems[letter]?.map((item) => (
                <li key={item.id} className="mb-4 pb-2 border-b border-gray-800 last:border-b-0">
                  <Link
                    href={`/slovnik/${item.slug}`}
                    className="text-lg font-medium text-white hover:text-teal transition-colors"
                  >
                    {item.term}
                  </Link>
                  {item.summary && <p className="text-gray-400 mt-1 text-sm">{item.summary}</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}
