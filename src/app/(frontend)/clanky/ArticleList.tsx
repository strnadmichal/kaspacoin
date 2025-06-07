'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import type { Post, Category } from '@/payload-types'

const PostCard = ({ post }: { post: Post }) => (
  <Link
    href={`/clanky/${post.slug}`}
    className="block group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden transition-all hover:border-teal/60 hover:shadow-lg hover:shadow-teal/10"
  >
    <div className="relative aspect-video">
      {typeof post.heroImage === 'object' && post.heroImage !== null && (
        <Media
          resource={post.heroImage}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
      {post.categories && Array.isArray(post.categories) && post.categories.length > 0 && (
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
          {post.categories.map(
            (category) =>
              typeof category === 'object' &&
              category.title && (
                <span
                  key={category.id}
                  className="text-xs bg-black/50 text-white backdrop-blur-lg px-3 py-1 rounded-full border border-white/10"
                >
                  {category.title}
                </span>
              ),
          )}
        </div>
      )}
    </div>
    <div className="p-6">
      <h3 className="font-medium text-lg text-white group-hover:text-teal transition-colors mb-2">
        {post.title}
      </h3>
      <p className="text-sm text-gray-400 mb-4 line-clamp-3">
        {post.meta?.description || 'Přečtěte si více...'}
      </p>
      <div className="flex items-center text-xs text-gray-500">
        {post.publishedAt && (
          <span>{format(new Date(post.publishedAt), 'd. MMMM yyyy', { locale: cs })}</span>
        )}
        {post.populatedAuthors &&
          Array.isArray(post.populatedAuthors) &&
          post.populatedAuthors.length > 0 && (
            <>
              <span className="mx-2">•</span>
              <span>{post.populatedAuthors.map((author) => author.name || '').join(', ')}</span>
            </>
          )}
      </div>
    </div>
  </Link>
)

export function ArticleList({ posts }: { posts: Post[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const allCategories = useMemo(() => {
    const categories = new Map<string, Category>()
    posts.forEach((post) => {
      post.categories?.forEach((cat) => {
        if (typeof cat === 'object' && cat.id && !categories.has(cat.id.toString())) {
          categories.set(cat.id.toString(), cat)
        }
      })
    })
    return Array.from(categories.values())
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) {
      return posts
    }
    return posts.filter((post) =>
      post.categories?.some(
        (cat) => typeof cat === 'object' && cat.id.toString() === selectedCategory,
      ),
    )
  }, [posts, selectedCategory])

  const buttonClasses = (isActive: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive ? 'bg-teal text-black' : 'bg-white/10 text-white hover:bg-white/20'
    }`

  return (
    <>
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={buttonClasses(selectedCategory === null)}
          >
            Všechny
          </button>
          {allCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id.toString())}
              className={buttonClasses(selectedCategory === category.id.toString())}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  )
}
