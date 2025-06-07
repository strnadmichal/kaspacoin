'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Globe, Send, Star } from 'lucide-react'

interface Resource {
  name: string
  description: string
  url: string
  tags?: string[]
}

interface Category {
  slug: string
  name: string
  description?: string
  resources: Resource[]
}

const ResourceCard = ({ resource }: { resource: Resource }) => (
  <Link
    href={resource.url}
    key={resource.name}
    className="block bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all h-full"
  >
    <div className="flex items-start gap-4">
      {/* Logo placeholder */}
      <div className="w-12 h-12 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center">
        <span className="text-xs text-gray-500">{resource.name.substring(0, 4)}</span>
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-medium">{resource.name}</h3>
        </div>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{resource.description}</p>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {/* These icons can be made dynamic later */}
            <Globe className="w-4 h-4" />
            <Send className="w-4 h-4" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {resource.tags?.map((tag: string) => (
              <span key={tag} className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </Link>
)

const EcosystemClient = ({ data }: { data: Category[] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredData =
    selectedCategory === 'all'
      ? data
      : data.filter((cat: Category) => cat.slug === selectedCategory)

  return (
    <>
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-teal text-black' : 'bg-white/10 hover:bg-white/20'}`}
        >
          Vše
        </button>
        {data.map((category: Category) => (
          <button
            key={category.slug}
            onClick={() => setSelectedCategory(category.slug)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === category.slug ? 'bg-teal text-black' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Ecosystem Sections */}
      <div className="space-y-16">
        {filteredData.map((category: Category) => (
          <section key={category.slug}>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">{category.name}</h2>
                {category.resources.length > 0 && (
                  <span className="text-gray-400 bg-white/5 px-2 py-1 rounded-md text-sm">
                    {category.resources.length}
                  </span>
                )}
              </div>
              {category.resources.length > 3 && (
                <Link href="#" className="text-sm text-teal hover:underline">
                  Zobrazit vše &gt;
                </Link>
              )}
            </div>
            <p className="text-gray-400 mb-6 max-w-2xl">{category.description}</p>

            {category.resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.resources.slice(0, 3).map((resource: Resource) => (
                  <ResourceCard key={resource.name} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white/5 rounded-lg border border-dashed border-white/10">
                <p className="text-gray-400">Brzy přidáme další zdroje...</p>
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  )
}

export default EcosystemClient
