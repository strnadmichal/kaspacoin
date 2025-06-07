'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import type { Merchant, MerchantCategory } from '@/payload-types'
import { ExternalLink, MapPin } from 'lucide-react'

const MerchantCard = ({ merchant }: { merchant: Merchant }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden flex flex-col">
    <div className="relative aspect-video bg-white/5">
      {typeof merchant.logo === 'object' && merchant.logo !== null && (
        <Media resource={merchant.logo} className="w-full h-full object-contain p-4" />
      )}
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="font-medium text-lg text-white mb-2">{merchant.name}</h3>
      {merchant.categories &&
        Array.isArray(merchant.categories) &&
        merchant.categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {merchant.categories.map(
              (category) =>
                typeof category === 'object' &&
                category.title && (
                  <span
                    key={category.id}
                    className="text-xs bg-teal/10 text-teal px-2 py-1 rounded-full"
                  >
                    {category.title}
                  </span>
                ),
            )}
          </div>
        )}
      <p className="text-sm text-gray-400 mb-4 flex-grow">{merchant.description}</p>
      {merchant.address && (merchant.address.street || merchant.address.city) && (
        <div className="flex items-center text-xs text-gray-400 mb-4">
          <MapPin className="w-3 h-3 mr-2" />
          <span>
            {[merchant.address.street, merchant.address.city, merchant.address.zip]
              .filter(Boolean)
              .join(', ')}
          </span>
        </div>
      )}
      <Link
        href={merchant.website}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-md bg-white/10 text-white font-medium hover:bg-white/20 transition-colors text-sm"
      >
        <span>Navštívit web</span>
        <ExternalLink className="w-3 h-3 ml-2" />
      </Link>
    </div>
  </div>
)

export function MerchantList({
  merchants,
  categories,
}: {
  merchants: Merchant[]
  categories: MerchantCategory[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredMerchants = useMemo(() => {
    if (!selectedCategory) {
      return merchants
    }
    return merchants.filter((merchant) =>
      merchant.categories?.some(
        (cat) => typeof cat === 'object' && cat.id.toString() === selectedCategory,
      ),
    )
  }, [merchants, selectedCategory])

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
          {categories.map((category) => (
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
        {filteredMerchants.map((merchant) => (
          <MerchantCard key={merchant.id} merchant={merchant} />
        ))}
      </div>
    </>
  )
}
