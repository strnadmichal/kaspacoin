import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import { GlossaryList } from './GlossaryList'

export const metadata: Metadata = {
  title: 'Slovník pojmů | Kaspacoin.cz',
  description: 'Vysvětlení důležitých pojmů ze světa kryptoměn, blockchainu a Kaspa ekosystému.',
}

const queryGlossary = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'glossary',
    where: {
      isPublished: {
        equals: true,
      },
    },
    sort: 'term',
    limit: 1000,
    depth: 2, // Make sure we get category data
  })

  return result.docs || []
})

export default async function GlossaryPage() {
  const items = await queryGlossary()

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      <div className="relative z-10">
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Slovník <span className="text-teal">pojmů</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl">
              Vysvětlení důležitých pojmů ze světa kryptoměn, blockchainu a Kaspa ekosystému.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-12">
          <GlossaryList initialItems={items} />
        </section>
      </div>
    </div>
  )
}
