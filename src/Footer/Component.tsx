import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

//import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
//import { CMSLink } from '@/components/Link'
//import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  //const footerData: Footer = await getCachedGlobal('footer', 1)()

  //const navItems = footerData?.navItems || []

  return (
    <footer className="container mx-auto px-6 py-6 border-t border-white/10">
      <div className="flex justify-between items-center text-sm text-gray-400">
        <div>© 2025 Kaspacoin.cz</div>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-white transition-colors">
            Kontakt
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Podmínky
          </Link>
        </div>
      </div>
    </footer>
  )
}
