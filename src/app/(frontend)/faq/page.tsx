import type { Metadata } from 'next'
import { FAQAccordion } from '@/components/FAQAccordion'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import type { Faq, FaqCategory } from '@/payload-types'

export const metadata: Metadata = {
  title: 'FAQ - Často kladené dotazy | Kaspacoin.cz',
  description:
    'Odpovědi na nejčastější otázky o Kaspa kryptoměně, BlockDAG technologii, těžbě a peněženkách.',
}

interface FaqCategoryWithFaqs extends FaqCategory {
  faqs: Faq[]
}

const queryFAQsByCategory = cache(async (): Promise<FaqCategoryWithFaqs[]> => {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'faq-categories',
    sort: 'name',
    depth: 0,
  })

  for (const category of categories.docs) {
    const faqs = await payload.find({
      collection: 'faq',
      where: {
        'category.id': {
          equals: category.id,
        },
        isPublished: {
          equals: true,
        },
      },
      sort: 'order createdAt',
      depth: 1,
    })
    ;(category as FaqCategoryWithFaqs).faqs = faqs.docs
  }

  return categories.docs.filter(
    (c) => (c as FaqCategoryWithFaqs).faqs && (c as FaqCategoryWithFaqs).faqs.length > 0,
  ) as FaqCategoryWithFaqs[]
})

const queryUncategorizedFAQs = cache(async (): Promise<Faq[]> => {
  const payload = await getPayload({ config: configPromise })
  const faqs = await payload.find({
    collection: 'faq',
    where: {
      category: {
        exists: false,
      },
      isPublished: {
        equals: true,
      },
    },
    sort: 'order createdAt',
    depth: 1,
  })
  return faqs.docs
})

export default async function FAQPage() {
  const [faqCategories, uncategorizedFaqs] = await Promise.all([
    queryFAQsByCategory(),
    queryUncategorizedFAQs(),
  ])

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
        <section className="container mx-auto px-6 pb-24 space-y-12">
          {uncategorizedFaqs.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-teal">Dotazy</h2>
              <FAQAccordion faqItems={uncategorizedFaqs} />
            </div>
          )}

          {faqCategories.map((category) => (
            <div key={category.id}>
              <h2 className="text-3xl font-bold mb-6 text-teal">{category.name}</h2>
              <FAQAccordion faqItems={category.faqs} />
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
