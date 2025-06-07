import React, { Fragment } from 'react'

import type { Glossary, Page } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { StructuredArticleComponent } from '@/blocks/StructuredArticleBlock/Component'

const blockComponents: Record<string, React.FC<any>> = {
  archive: ArchiveBlock,
  content: ContentBlock,
  structuredArticle: StructuredArticleComponent,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
}

const getGlossaryTerms = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const terms = await payload.find({
    collection: 'glossary',
    where: { isPublished: { equals: true } },
    limit: 500,
    depth: 0,
  })
  return terms.docs
})

export const RenderBlocks: React.FC<{
  blocks: Page['layout']
}> = async (props) => {
  const { blocks } = props
  const glossaryTerms: Glossary[] = await getGlossaryTerms()

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const blockProps = { ...block, glossaryTerms }
              return blockType === 'structuredArticle' ? (
                <Block key={index} {...blockProps} />
              ) : (
                <div className="my-16" key={index}>
                  <Block {...blockProps} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
