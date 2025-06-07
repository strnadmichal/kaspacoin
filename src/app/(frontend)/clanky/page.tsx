import React from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import type { Post } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Články | Kaspacoin.cz',
  description: 'Prozkoumejte nejnovější články, návody a analýzy ze světa Kaspa a kryptoměn.',
}

const queryPosts = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    depth: 2,
    draft,
    overrideAccess: draft,
  })

  return result.docs || []
})

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

export default async function ArticlesPage() {
  const posts = await queryPosts()

  if (!posts || posts.length === 0) {
    return notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      <div className="relative z-10">
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Všechny <span className="text-teal">články</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl">
              Prozkoumejte nejnovější články, návody a analýzy ze světa Kaspa, BlockDAG technologie
              a kryptoměn.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
