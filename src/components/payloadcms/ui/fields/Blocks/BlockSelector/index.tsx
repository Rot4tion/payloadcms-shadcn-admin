'use client'
import type { I18nClient } from '@payloadcms/translations'
import type { ClientBlock } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React, { Fragment, useEffect, useMemo, useState } from 'react'

import { ThumbnailCard } from '../../../elements/ThumbnailCard/index'
import { DefaultBlockImage } from '../../../graphics/DefaultBlockImage/index'
import { useControllableState } from '../../../hooks/useControllableState'
import { useConfig } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { BlockSearch } from './BlockSearch/index'
import { cn } from '@/lib/utils'

export type Props = {
  readonly blocks: (ClientBlock | string)[]
  readonly onSelect?: (blockType: string) => void
  /**
   * Control the search term state externally
   */
  searchTerm?: string
}

const getBlockLabel = (block: ClientBlock, i18n: I18nClient) => {
  if (typeof block.labels.singular === 'string') {
    return block.labels.singular.toLowerCase()
  }
  if (typeof block.labels.singular === 'object') {
    return getTranslation(block.labels.singular, i18n).toLowerCase()
  }
  return ''
}

export const BlockSelector: React.FC<Props> = (props) => {
  const { blocks, onSelect, searchTerm: searchTermFromProps } = props

  const [searchTerm, setSearchTerm] = useControllableState(searchTermFromProps ?? '')

  const [filteredBlocks, setFilteredBlocks] = useState(blocks)
  const { i18n } = useTranslation()
  const { config } = useConfig()

  const blockGroups = useMemo(() => {
    const groups: Record<string, (ClientBlock | string)[]> = {
      _none: [],
    }

    filteredBlocks.forEach((block) => {
      if (typeof block === 'object' && block.admin?.group) {
        const group = block.admin.group
        const label = typeof group === 'string' ? group : getTranslation(group, i18n)

        if (Object.hasOwn(groups, label)) {
          groups[label].push(block)
        } else {
          groups[label] = [block]
        }
      } else {
        groups._none.push(block)
      }
    })

    return groups
  }, [filteredBlocks, i18n])

  useEffect(() => {
    const searchTermToUse = searchTerm.toLowerCase()

    const matchingBlocks = blocks?.reduce((matchedBlocks, _block) => {
      const block = typeof _block === 'string' ? config.blocksMap[_block] : _block
      const blockLabel = getBlockLabel(block, i18n)
      if (blockLabel.includes(searchTermToUse)) {
        matchedBlocks.push(block)
      }
      return matchedBlocks
    }, [])

    setFilteredBlocks(matchingBlocks)
  }, [searchTerm, blocks, i18n, config.blocksMap])

  return (
    <Fragment>
      <BlockSearch setSearchTerm={setSearchTerm} />
      <div className="pt-[calc(var(--base)*1.5)] max-lg:pt-[calc(var(--base)*1.75)] max-md:pt-[calc(var(--base)*0.75)]">
        <ul className="p-0 flex flex-col gap-[calc(var(--base)*1.5)] max-lg:gap-[calc(var(--base)*1.75)] max-md:gap-[calc(var(--base)*0.75)]">
          {Object.entries(blockGroups).map(([groupLabel, groupBlocks]) =>
            !groupBlocks.length ? null : (
              <li
                className={cn(
                  'list-none',
                  groupLabel === '_none' &&
                    'order-1 pt-[calc(var(--base)*1.5)] border-t border-border only:pt-0 only:border-t-0 max-lg:pt-[calc(var(--base)*1.75)] max-md:pt-[calc(var(--base)*0.75)]',
                )}
                key={groupLabel}
              >
                {groupLabel !== '_none' && (
                  <h3 className="pb-[calc(var(--base)*0.5)]">{groupLabel}</h3>
                )}
                <ul className="relative p-0 list-none grid grid-cols-6 gap-(--base) max-xl:grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2">
                  {groupBlocks.map((_block, index) => {
                    const block = typeof _block === 'string' ? config.blocksMap[_block] : _block

                    const { slug, imageAltText, imageURL, labels: blockLabels } = block

                    return (
                      <li key={index}>
                        <ThumbnailCard
                          alignLabel="center"
                          label={getTranslation(blockLabels?.singular, i18n)}
                          onClick={() => {
                            if (typeof onSelect === 'function') {
                              onSelect(slug)
                            }
                          }}
                          thumbnail={
                            <div className="flex items-center justify-center w-full aspect-3/2 overflow-hidden [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_svg]:w-full [&_svg]:h-full [&_svg]:object-cover">
                              {imageURL ? (
                                <img alt={imageAltText} src={imageURL} />
                              ) : (
                                <DefaultBlockImage />
                              )}
                            </div>
                          }
                        />
                      </li>
                    )
                  })}
                </ul>
              </li>
            ),
          )}
        </ul>
      </div>
    </Fragment>
  )
}
