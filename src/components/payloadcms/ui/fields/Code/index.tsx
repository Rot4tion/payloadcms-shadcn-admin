// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { CodeFieldClientComponent } from 'payload'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import { CodeEditor } from '../../elements/CodeEditor/index'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index'
import { FieldDescription } from '../../fields/FieldDescription/index'
import { FieldError } from '../../fields/FieldError/index'
import { FieldLabel } from '../../fields/FieldLabel/index'
import { useField } from '../../forms/useField/index'
import { withCondition } from '../../forms/withCondition/index'
import { mergeFieldStyles } from '../mergeFieldStyles'

const prismToMonacoLanguageMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
}

const CodeFieldComponent: CodeFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: { className, description, editorOptions, editorProps, language = 'javascript' } = {},
      label,
      localized,
      required,
    },
    onMount,
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const inputChangeFromRef = React.useRef<'formState' | 'internalEditor'>('formState')
  const [recalculatedHeightAt, setRecalculatedHeightAt] = useState<number | undefined>(Date.now())

  const memoizedValidate = useCallback(
    (value, options) => {
      if (typeof validate === 'function') {
        return validate(value, { ...options, required })
      }
    },
    [validate, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    initialValue,
    path,
    setValue,
    showError,
    value,
  } = useField<string>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const stringValueRef = React.useRef<string>(
    (value || initialValue) !== undefined ? (value ?? initialValue) : undefined,
  )

  const handleChange = useCallback(
    (val: string) => {
      if (readOnly || disabled) {
        return
      }
      inputChangeFromRef.current = 'internalEditor'

      try {
        setValue(val ? val : null)
        stringValueRef.current = val
      } catch (e) {
        setValue(val ? val : null)
        stringValueRef.current = val
      }
    },
    [readOnly, disabled, setValue],
  )

  useEffect(() => {
    if (inputChangeFromRef.current === 'formState') {
      stringValueRef.current =
        (value || initialValue) !== undefined ? (value ?? initialValue) : undefined
      setRecalculatedHeightAt(Date.now())
    }

    inputChangeFromRef.current = 'formState'
  }, [initialValue, path, value])

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <div
      className={cn(
        'field-type code-field relative flex flex-col gap-2',
        className,
        showError && 'error',
        (readOnly || disabled) && 'read-only opacity-60',
      )}
      style={styles}
    >
      <div className="flex items-center justify-between">
        <RenderCustomComponent
          CustomComponent={Label}
          Fallback={
            <FieldLabel label={label} localized={localized} path={path} required={required} />
          }
        />
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        {BeforeInput}
        <div
          className={cn(
            'overflow-hidden rounded-md border bg-muted/50',
            showError && 'border-destructive',
          )}
        >
          <CodeEditor
            defaultLanguage={prismToMonacoLanguageMap[language as string] || language}
            onChange={handleChange}
            onMount={onMount}
            options={editorOptions}
            readOnly={readOnly || disabled}
            recalculatedHeightAt={recalculatedHeightAt}
            value={stringValueRef.current}
            wrapperProps={{
              id: `field-${path?.replace(/\./g, '__')}`,
            }}
            {...(editorProps || {})}
          />
        </div>
        {AfterInput}
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  )
}

export const CodeField = withCondition(CodeFieldComponent)
