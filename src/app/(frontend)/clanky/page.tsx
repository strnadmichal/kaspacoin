import React from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ArticleList } from './ArticleList'

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
          <ArticleList posts={posts} />
        </section>
      </div>
    </div>
  )
}
