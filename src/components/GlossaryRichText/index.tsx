'use client'

import React, { useRef, useEffect, useState } from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import RichText from '@/components/RichText'
import type { Glossary } from '@/payload-types'
import { renderToStaticMarkup } from 'react-dom/server'
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
  DOMNode,
  Text,
} from 'html-react-parser'
import Link from 'next/link'

type GlossaryRichTextProps = {
  content: DefaultTypedEditorState
  glossaryTerms: Glossary[]
}

export function GlossaryRichText({ content, glossaryTerms }: GlossaryRichTextProps) {
  const [parsedContent, setParsedContent] = useState<React.ReactNode>(null)

  useEffect(() => {
    if (content && glossaryTerms.length > 0) {
      const staticHtml = renderToStaticMarkup(<RichText data={content} enableProse={false} />)

      const validTerms = glossaryTerms.filter((term) => term && term.term)
      if (validTerms.length === 0) {
        setParsedContent(<RichText data={content} />)
        return
      }

      const termsRegex = new RegExp(
        `\\b(${validTerms
          .map((term) => term.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
          .join('|')})\\b`,
        'gi',
      )

      const termMap = new Map(validTerms.map((term) => [term.term.toLowerCase(), term.slug || '']))

      const options: HTMLReactParserOptions = {
        replace: (domNode: DOMNode) => {
          if (
            domNode instanceof Text &&
            domNode.parent instanceof Element &&
            !['a', 'h1', 'h2', 'h3', 'h4'].includes(domNode.parent.tagName)
          ) {
            const text = domNode.data
            if (termsRegex.test(text)) {
              const parts = text.split(termsRegex)
              return (
                <>
                  {parts.map((part, index) => {
                    const slug = termMap.get(part.toLowerCase())
                    if (slug) {
                      return (
                        <Link
                          key={index}
                          href={`/slovnik/${slug}`}
                          className="text-teal border-b border-teal border-dotted hover:border-solid"
                        >
                          {part}
                        </Link>
                      )
                    }
                    return <React.Fragment key={index}>{part}</React.Fragment>
                  })}
                </>
              )
            }
          }
        },
      }
      setParsedContent(parse(staticHtml, options))
    } else {
      setParsedContent(<RichText data={content} />)
    }
  }, [content, glossaryTerms])

  return <div className="prose md:prose-md dark:prose-invert max-w-none">{parsedContent}</div>
}
