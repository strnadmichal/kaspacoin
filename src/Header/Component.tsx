import { HeaderClient } from './Component.client'
import React from 'react'

// For now, we'll use static data instead of CMS
const staticHeaderData = {
  id: 1,
  navItems: [
    { link: { type: 'custom' as const, url: '/co-je-kaspa', label: 'Co je Kaspa?' } },
    { link: { type: 'custom' as const, url: '#', label: 'Články' } },
    { link: { type: 'custom' as const, url: '/faq', label: 'FAQ' } },
    { link: { type: 'custom' as const, url: '#', label: 'Obchodníci' } },
    { link: { type: 'custom' as const, url: '/slovnik', label: 'Slovník' } },
    { link: { type: 'custom' as const, url: '#', label: 'Komunita' } },
  ],
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

export async function Header() {
  // You can later replace this with: await getCachedGlobal('header', 1)()
  const headerData = staticHeaderData

  return <HeaderClient data={headerData} />
}
