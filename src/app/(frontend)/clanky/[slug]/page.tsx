import React from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Post, Glossary } from '@/payload-types'
import { Media } from '@/components/Media'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { GlossaryRichText } from '@/components/GlossaryRichText'
import { cache } from 'react'

// Force all dynamic pages to be static
export const dynamic = 'force-static'

const queryGlossaryTerms = cache(async (): Promise<Glossary[]> => {
  const payload = await getPayload({ config: configPromise })
  const terms = await payload.find({
    collection: 'glossary',
    limit: 1000,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })
  return terms.docs
})

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const post = posts.docs[0]
  if (!post) return notFound()

  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description,
    openGraph: {
      title: post.meta?.title || post.title,
      description: post.meta?.description || '',
      url: `/clanky/${slug}`,
      images:
        post.meta?.image && typeof post.meta.image === 'object'
          ? [
              {
                url: post.meta.image.url || '',
                width: post.meta.image.width || 1200,
                height: post.meta.image.height || 630,
              },
            ]
          : [],
    },
  }
}

// Main component for the glossary term page
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = await draftMode()

  const posts = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  })

  const post = posts.docs[0]
  const glossaryTerms = await queryGlossaryTerms()

  if (!post) {
    return notFound()
  }

  const { title, heroImage, publishedAt, content } = post

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      <div className="relative z-10">
        <section className="container mx-auto px-6 pt-12">
          <Link
            href="/clanky"
            className="inline-flex items-center text-teal hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět na všechny články
          </Link>
        </section>
        {typeof heroImage === 'object' && heroImage !== null && (
          <div className="container mx-auto px-6 aspect-video max-h-[500px] rounded-2xl overflow-hidden">
            <Media resource={heroImage} className="w-full h-full object-cover" />
          </div>
        )}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{title}</h1>
            <div className="flex items-center text-gray-400 text-sm mb-8">
              {publishedAt && (
                <span>
                  Publikováno {format(new Date(publishedAt), 'd. MMMM yyyy', { locale: cs })}
                </span>
              )}
              {post.populatedAuthors &&
                Array.isArray(post.populatedAuthors) &&
                post.populatedAuthors.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>
                      Autor: {post.populatedAuthors.map((author) => author.name || '').join(', ')}
                    </span>
                  </>
                )}
            </div>
            <div className="max-w-4xl mx-auto">
              {content && <GlossaryRichText content={content} glossaryTerms={glossaryTerms} />}
            </div>
          </div>
        </section>
        <div className="h-24" /> {/* Spacer at the bottom */}
      </div>
    </div>
  )
}

// Generate static paths for all published glossary terms
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    })

    return posts.docs.map(({ slug }) => ({ slug: slug || '' }))
  } catch (error) {
    console.error('Error generating static params for posts:', error)
    return []
  }
}
