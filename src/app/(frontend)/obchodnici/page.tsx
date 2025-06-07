import React from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import type { Merchant, MerchantCategory } from '@/payload-types'
import { MerchantList } from './MerchantList'

export const metadata: Metadata = {
  title: 'Obchodníci přijímající Kaspa | Kaspacoin.cz',
  description:
    'Prozkoumejte seznam obchodů, e-shopů a služeb v České republice, kde můžete platit kryptoměnou Kaspa.',
}

const queryMerchants = cache(async (): Promise<Merchant[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'merchants',
    where: {
      isPublished: {
        equals: true,
      },
    },
    sort: 'name',
    depth: 2,
  })

  return result.docs || []
})

const queryMerchantCategories = cache(async (): Promise<MerchantCategory[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'merchant-categories',
    sort: 'title',
    depth: 0,
  })

  return result.docs || []
})

export default async function MerchantsPage() {
  const [merchants, categories] = await Promise.all([queryMerchants(), queryMerchantCategories()])

  if (!merchants || merchants.length === 0) {
    return notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      <div className="relative z-10">
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Kde platit <span className="text-teal">Kaspou</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl">
              Prozkoumejte seznam obchodů, e-shopů a služeb v České republice, kde můžete bez
              problémů zaplatit kryptoměnou Kaspa.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-24">
          <MerchantList merchants={merchants} categories={categories} />
        </section>
      </div>
    </div>
  )
}
