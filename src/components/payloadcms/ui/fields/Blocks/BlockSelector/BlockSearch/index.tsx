'use client'
import React from 'react'

import { SearchIcon } from '../../../../icons/Search/index'
import { useTranslation } from '../../../../providers/Translation/index'

export const BlockSearch: React.FC<{ setSearchTerm: (term: string) => void }> = (props) => {
  const { setSearchTerm } = props
  const { t } = useTranslation()

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="sticky top-0 flex w-full items-center z-1">
      <input
        className="border border-input bg-background rounded-md px-3 py-2 w-full max-lg:mb-0"
        onChange={handleChange}
        placeholder={t('fields:searchForBlock')}
      />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[calc(var(--base)*2)] mx-[calc(var(--base)*0.25)] [&_.stroke]:stroke-muted-foreground">
        <SearchIcon />
      </div>
    </div>
  )
}
