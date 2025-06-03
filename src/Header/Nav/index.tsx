'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navItems = data?.navItems || []

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center">
        <div className="flex space-x-8">
          {navItems.map(({ link }, i) => {
            return (
              <CMSLink 
                key={i} 
                {...link} 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              />
            )
          })}
        </div>
      </nav>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 py-4">
          <div className="flex flex-col space-y-4 px-6">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink 
                  key={i} 
                  {...link} 
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                />
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}
