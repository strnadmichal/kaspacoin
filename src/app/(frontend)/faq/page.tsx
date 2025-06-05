import type { Metadata } from 'next'
import { FAQAccordion } from '@/components/FAQAccordion'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

export const metadata: Metadata = {
  title: 'FAQ - Často kladené dotazy | Kaspacoin.cz',
  description:
    'Odpovědi na nejčastější otázky o Kaspa kryptoměně, BlockDAG technologii, těžbě a peněženkách.',
}

const queryFAQ = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'faq',
    where: {
      isPublished: {
        equals: true,
      },
    },
    sort: 'order createdAt',
    depth: 1,
    draft,
    overrideAccess: draft,
  })

  return result.docs || []
})

export default async function FAQPage() {
  const faqItems = await queryFAQ()

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Často kladené <span className="text-teal">dotazy</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl">
              Odpovědi na nejčastější otázky o Kaspa, BlockDAG technologii a všem, co potřebujete
              vědět.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="container mx-auto px-6 pb-12">
          <div>
            <FAQAccordion faqItems={faqItems} />
          </div>
        </section>
      </div>
    </div>
  )
}
