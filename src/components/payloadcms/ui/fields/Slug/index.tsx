'use client'

import type { SlugFieldClientProps } from 'payload'

import React, { useCallback, useState } from 'react'

import { Button } from '../../elements/Button/index'
import { useForm } from '../../forms/Form/index'
import { useField } from '../../forms/useField/index'
import { useDocumentInfo } from '@payloadcms/ui'
import { useServerFunctions } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { FieldLabel } from '../FieldLabel/index'
import { TextInput } from '../Text/index'

/**
 * @experimental This component is experimental and may change or be removed in the future. Use at your own risk.
 */
export const SlugField: React.FC<SlugFieldClientProps> = ({
  field,
  path,
  readOnly: readOnlyFromProps,
  useAsSlug,
}) => {
  const { label } = field

  const { t } = useTranslation()

  const { collectionSlug, globalSlug } = useDocumentInfo()

  const { slugify } = useServerFunctions()

  const { setValue, value } = useField<string>({ path: path || field.name })

  const { getData, getDataByPath } = useForm()

  const [isLocked, setIsLocked] = useState(true)

  /**
   * This method allows the user to generate their slug on demand, e.g. when they click the "generate" button.
   * It uses the `slugify` server function to gain access to their custom slugify function defined in their field config.
   */
  const handleGenerate = useCallback(
    async (e: React.MouseEvent<Element>) => {
      e.preventDefault()

      const valueToSlugify = getDataByPath(useAsSlug)

      const formattedSlug = await slugify({
        collectionSlug,
        data: getData(),
        globalSlug,
        path,
        valueToSlugify,
      })

      if (formattedSlug === null || formattedSlug === undefined) {
        setValue('')
        return
      }

      /**
       * The result may be the same as the current value, and if so, we don't want to trigger a re-render.
       */
      if (value !== formattedSlug) {
        setValue(formattedSlug)
      }
    },
    [setValue, value, useAsSlug, getData, slugify, getDataByPath, collectionSlug, globalSlug, path],
  )

  const toggleLock = useCallback((e: React.MouseEvent<Element>) => {
    e.preventDefault()
    setIsLocked((prev) => !prev)
  }, [])

  return (
    <div className="field-type w-full">
      <div className="flex items-center justify-between gap-[calc(var(--base)/2)]">
        <FieldLabel htmlFor={`field-${path}`} label={label} />
        <div className="flex items-center gap-1">
          {!isLocked && (
            <Button buttonStyle="none" className="m-0 pb-1.25" onClick={handleGenerate}>
              {t('authentication:generate')}
            </Button>
          )}
          <Button buttonStyle="none" className="m-0 pb-1.25" onClick={toggleLock}>
            {isLocked ? t('general:unlock') : t('general:lock')}
          </Button>
        </div>
      </div>
      <TextInput
        onChange={setValue}
        path={path || field.name}
        readOnly={Boolean(readOnlyFromProps || isLocked)}
        value={value}
      />
    </div>
  )
}
