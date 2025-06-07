'use client'

import React, { useEffect, useState } from 'react'
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
import * as Tooltip from '@radix-ui/react-tooltip'

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

      const termMap = new Map(
        validTerms.map((term) => [
          term.term.toLowerCase(),
          { slug: term.slug || '', summary: term.summary || '' },
        ]),
      )

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
                    const termData = termMap.get(part.toLowerCase())
                    if (termData && termData.slug) {
                      return (
                        <Tooltip.Provider key={index} delayDuration={100}>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <Link
                                href={`/slovnik/${termData.slug}`}
                                className="text-teal border-b border-teal border-dotted hover:border-solid"
                              >
                                {part}
                              </Link>
                            </Tooltip.Trigger>
                            {termData.summary && (
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  className="z-50 max-w-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 rounded-lg border border-teal/40 bg-gray-950 px-3 py-2 text-sm text-gray-200 shadow-lg shadow-teal/10"
                                  sideOffset={5}
                                >
                                  {termData.summary}
                                  <Tooltip.Arrow className="fill-gray-950" />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            )}
                          </Tooltip.Root>
                        </Tooltip.Provider>
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
