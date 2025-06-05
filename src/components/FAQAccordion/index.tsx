'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import RichText from '@/components/RichText'
import type { Faq } from '@/payload-types'

interface FAQAccordionProps {
  faqItems: Faq[]
}

interface FAQItemProps {
  question: string
  answer: any
  isOpen: boolean
  onToggle: () => void
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
      >
        <h3 className="font-medium text-lg">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white/2">
          <div className="prose prose-invert prose-sm max-w-none">
            <RichText data={answer} enableGutter={false} />
          </div>
        </div>
      )}
    </div>
  )
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqItems }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  if (!faqItems || faqItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Zatím nejsou k dispozici žádné otázky.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {faqItems.map((item, index) => (
        <FAQItem
          key={item.id}
          question={item.question}
          answer={item.answer}
          isOpen={openItems.has(index)}
          onToggle={() => toggleItem(index)}
        />
      ))}
    </div>
  )
}
