import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center text-center relative overflow-hidden bg-black text-white">
      <div className="relative z-10 p-8">
        <h1 className="text-8xl font-bold text-teal animate-pulse">404</h1>
        <p className="text-2xl font-semibold mt-4">Stránka nenalezena</p>
        <p className="text-gray-400 mt-2 max-w-md mx-auto">
          Omlouváme se, ale stránka, kterou hledáte, neexistuje, byla přesunuta nebo smazána.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-md bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Zpět na hlavní stránku</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
