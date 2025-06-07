import React from 'react'
import EcosystemClient from './EcosystemClient'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

// Using cache to optimize data fetching
const getEcosystemData = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const sourceCategories = await payload.find({
    collection: 'source-categories',
    depth: 2, // populate sources and their details
  })

  // We need to get all sources and group them by category
  const allSources = await payload.find({
    collection: 'sources',
    depth: 1, // populate category details
    limit: 1000, // assume less than 1000 sources for now
  })

  const data = sourceCategories.docs.map((category) => {
    const resources = allSources.docs
      .filter((source) => {
        if (typeof source.category === 'object' && source.category !== null) {
          return source.category.id === category.id
        }
        return false
      })
      .map((source) => ({
        name: source.name,
        description: source.description,
        url: source.url,
        // The tags are stored as an array of objects with a 'tag' property
        tags: (source.tags?.map((t) => t.tag).filter(Boolean) as string[]) || [],
      }))

    return {
      slug: category.name.toLowerCase().replace(/ /g, '-'), // generate a slug from the name
      name: category.name,
      description: category.description || undefined,
      resources: resources,
    }
  })

  return data
})

export default async function EcosystemPage() {
  const ecosystemData = await getEcosystemData()
  return <EcosystemClient data={ecosystemData} />
}
