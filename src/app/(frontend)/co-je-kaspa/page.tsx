import type { Metadata } from 'next'
// import { ArticleContentComponent } from '@/blocks/ArticleContent/Component' // Nahrazeno RenderBlocks
import { RenderBlocks } from '@/blocks/RenderBlocks' // Pro dynamické renderování bloků z CMS
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation' // Pro případ, že stránka v CMS neexistuje
import React, { cache } from 'react' // cache pro optimalizaci

// Metadata zůstává, ale mohla by být také dynamická, pokud by se titulek/popis bral z CMS
export const metadata: Metadata = {
  title: 'Co je Kaspa? | Kaspacoin.cz',
  description:
    'Kompletní průvodce kryptoměnou Kaspa, její BlockDAG technologií a výhodami pro rychlé transakce.',
}

// Funkce pro načtení dat stránky z CMS (podobná té v [slug]/page.tsx)
const queryPageBySlug = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2, // Načteme i vnořená data, např. obrázky v MediaBlock
    draft,
    overrideAccess: draft, // Povolíme přístup k draftům pokud je draft mode zapnutý
  })
  return result.docs?.[0] || null
})

// Hlavní komponenta stránky, nyní asynchronní pro načítání dat
export default async function CoJeKaspaPage() {
  // Přejmenoval jsem pro srozumitelnost
  const pageSlug = 'co-je-kaspa' // Pevně daný slug pro tuto konkrétní stránku
  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug(pageSlug)

  if (!page) {
    return notFound() // Pokud stránka v CMS neexistuje, zobrazí se 404
  }

  // Extrahujeme layout (bloky) a hero sekci (pokud ji stránka v CMS má definovanou)
  const { layout } = page
  // const { hero } = page; // Pokud by hero sekce byla také z CMS

  // sampleContent se již nepoužívá, obsah se bere z page.layout

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      {/* Content with relative positioning */}
      <div className="relative z-10">
        {/* Hero Section - zatím zůstává statická, ale mohla by se také načítat z `page.hero` */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Co je <span className="text-teal">Kaspa</span>?
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl">
              Průvodce revoluční kryptoměnou založenou na BlockDAG technologii, která nabízí
              nejrychlejší transakce v krypto prostoru.
            </p>
          </div>
        </section>

        {/* Dynamicky renderované bloky z CMS */}
        {/* Místo ArticleContentComponent s sampleContent použijeme RenderBlocks */}
        <RenderBlocks blocks={layout} />
      </div>
    </div>
  )
}
