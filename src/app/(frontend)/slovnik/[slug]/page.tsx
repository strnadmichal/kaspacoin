import React from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Glossary } from '@/payload-types'
import RichText from '@/components/RichText'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Force all dynamic pages to be static
export const dynamic = 'force-static'

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params
  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = await draftMode()

  const glossaryTerm = await payload.find({
    collection: 'glossary',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 1,
    draft,
    overrideAccess: draft,
  })

  const doc = glossaryTerm.docs[0]

  if (!doc) {
    return notFound()
  }

  return {
    title: `${doc.term} | Slovník pojmů Kaspacoin.cz`,
    description: `Vysvětlení pojmu ${doc.term}. Co znamená, jak funguje a proč je důležitý v kontextu kryptoměn a Kaspa.`,
  }
}

// Main component for the glossary term page
export default async function GlossaryTermPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = await draftMode()

  const glossaryTerm = await payload.find({
    collection: 'glossary',
    where: {
      slug: {
        equals: slug,
      },
      isPublished: {
        equals: true,
      },
    },
    limit: 1,
    depth: 1,
    draft,
    overrideAccess: draft,
  })

  if (!glossaryTerm.docs[0]) {
    return notFound()
  }

  const { term, definition } = glossaryTerm.docs[0]

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      <div className="relative z-10">
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <div className="mb-8">
              <Link
                href="/slovnik"
                className="inline-flex items-center text-teal hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zpět na slovník
              </Link>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-4">{term}</h1>
            <div className="flex flex-wrap gap-2">
              {glossaryTerm.docs[0].categories?.map((cat) => {
                if (typeof cat === 'object' && cat.title) {
                  return (
                    <span
                      key={cat.id}
                      className="text-sm bg-gray-700 text-teal px-3 py-1 rounded-full"
                    >
                      {cat.title}
                    </span>
                  )
                }
                return null
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-12">
          <div className="prose prose-invert prose-lg max-w-4xl">
            <RichText data={definition} />
          </div>
        </section>
      </div>
    </div>
  )
}

// Generate static paths for all published glossary terms
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const glossaryTerms = await payload.find({
      collection: 'glossary',
      where: {
        isPublished: {
          equals: true,
        },
      },
      limit: 1000,
    })

    const filteredDocs = glossaryTerms.docs.filter((doc) => Boolean(doc.slug))

    return filteredDocs.map(({ slug }) => ({ slug }))
  } catch (error) {
    console.error('Error generating static params for glossary:', error)
    return []
  }
}
