// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { Operator } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { transformWhereQuery, validateWhereQuery } from 'payload/shared'
import React, { useMemo } from 'react'

import type { AddCondition, RemoveCondition, UpdateCondition, WhereBuilderProps } from './types'

import { useAuth } from '@payloadcms/ui'
import { useListQuery } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { reduceFieldsToOptions } from '../../utilities/reduceFieldsToOptions'
import { Button } from '../Button'
import { Condition } from './Condition'
import { fieldTypeConditions, getValidFieldOperators } from './field-types'

const baseClass = 'where-builder'

export { WhereBuilderProps }

/**
 * The WhereBuilder component is used to render the filter controls for a collection's list view.
 * It is part of the {@link ListControls} component which is used to render the controls (search, filter, where).
 */
export const WhereBuilder: React.FC<WhereBuilderProps> = (props) => {
  const { collectionPluralLabel, collectionSlug, fields, renderedFilters, resolvedFilterOptions } =
    props
  const { i18n, t } = useTranslation()
  const { permissions } = useAuth()

  const fieldPermissions = permissions?.collections?.[collectionSlug]?.fields

  const reducedFields = useMemo(
    () =>
      reduceFieldsToOptions({
        fieldPermissions,
        fields,
        i18n,
      }),
    [fieldPermissions, fields, i18n],
  )

  const { handleWhereChange, query } = useListQuery()

  const conditions = useMemo(() => {
    const whereFromSearch = query.where

    if (whereFromSearch) {
      if (validateWhereQuery(whereFromSearch)) {
        return whereFromSearch.or
      }

      // Transform the where query to be in the right format. This will transform something simple like [text][equals]=example%20post to the right format
      const transformedWhere = transformWhereQuery(whereFromSearch)

      if (validateWhereQuery(transformedWhere)) {
        return transformedWhere.or
      }

      console.warn(`Invalid where query in URL: ${JSON.stringify(whereFromSearch)}`) // eslint-disable-line no-console
    }

    return []
  }, [query.where])

  const addCondition: AddCondition = React.useCallback(
    async ({ andIndex, field, orIndex, relation }) => {
      const newConditions = [...conditions]

      const defaultOperator = fieldTypeConditions[field.field.type].operators[0].value

      if (relation === 'and') {
        newConditions[orIndex].and.splice(andIndex, 0, {
          [String(field.value)]: {
            [defaultOperator]: undefined,
          },
        })
      } else {
        newConditions.push({
          and: [
            {
              [String(field.value)]: {
                [defaultOperator]: undefined,
              },
            },
          ],
        })
      }

      await handleWhereChange({ or: newConditions })
    },
    [conditions, handleWhereChange],
  )

  const updateCondition: UpdateCondition = React.useCallback(
    async ({ andIndex, field, operator: incomingOperator, orIndex, value }) => {
      const existingCondition = conditions[orIndex].and[andIndex]

      if (typeof existingCondition === 'object' && field.value) {
        const { validOperator } = getValidFieldOperators({
          field: field.field,
          operator: incomingOperator,
        })
        const newRowCondition = {
          [String(field.value)]: { [validOperator]: value },
        }

        const newConditions = [...conditions]
        newConditions[orIndex].and[andIndex] = newRowCondition
        await handleWhereChange({ or: newConditions })
      }
    },
    [conditions, handleWhereChange],
  )

  const removeCondition: RemoveCondition = React.useCallback(
    async ({ andIndex, orIndex }) => {
      const newConditions = [...conditions]
      newConditions[orIndex].and.splice(andIndex, 1)

      if (newConditions[orIndex].and.length === 0) {
        newConditions.splice(orIndex, 1)
      }

      await handleWhereChange({ or: newConditions })
    },
    [conditions, handleWhereChange],
  )

  return (
    <div className="where-builder bg-muted p-4 flex flex-col gap-2 [&_.btn]:m-0 [&_.btn]:self-start">
      {conditions.length > 0 && (
        <React.Fragment>
          <p className="text-primary font-medium">
            {t('general:filterWhere', { label: getTranslation(collectionPluralLabel, i18n) })}
          </p>
          <ul className="list-none m-0 p-0 flex flex-col gap-2">
            {conditions.map((or, orIndex) => {
              const compoundOrKey = `${orIndex}_${Array.isArray(or?.and) ? or.and.length : ''}`

              return (
                <li key={compoundOrKey} className="flex flex-col gap-2">
                  {orIndex !== 0 && (
                    <div className="text-primary font-medium">{t('general:or')}</div>
                  )}
                  <ul className="list-none m-0 p-0 flex flex-col gap-2">
                    {Array.isArray(or?.and) &&
                      or.and.map((_, andIndex) => {
                        const condition = conditions[orIndex].and[andIndex]
                        const fieldPath = Object.keys(condition)[0]

                        const operator =
                          (Object.keys(condition?.[fieldPath] || {})?.[0] as Operator) || undefined

                        const value = condition?.[fieldPath]?.[operator] || undefined

                        return (
                          <li key={andIndex} className="flex flex-col gap-2">
                            {andIndex !== 0 && (
                              <div className="text-primary font-medium">{t('general:and')}</div>
                            )}
                            <Condition
                              addCondition={addCondition}
                              andIndex={andIndex}
                              fieldPath={fieldPath}
                              filterOptions={resolvedFilterOptions?.get(fieldPath)}
                              operator={operator}
                              orIndex={orIndex}
                              reducedFields={reducedFields}
                              removeCondition={removeCondition}
                              RenderedFilter={renderedFilters?.get(fieldPath)}
                              updateCondition={updateCondition}
                              value={value}
                            />
                          </li>
                        )
                      })}
                  </ul>
                </li>
              )
            })}
          </ul>
          <Button
            buttonStyle="icon-label"
            icon="plus"
            iconPosition="left"
            iconStyle="with-border"
            onClick={async () => {
              await addCondition({
                andIndex: 0,
                field: reducedFields.find((field) => !field.field.admin?.disableListFilter),
                orIndex: conditions.length,
                relation: 'or',
              })
            }}
          >
            {t('general:or')}
          </Button>
        </React.Fragment>
      )}
      {conditions.length === 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-primary font-medium">{t('general:noFiltersSet')}</div>
          <Button
            buttonStyle="icon-label"
            icon="plus"
            iconPosition="left"
            iconStyle="with-border"
            onClick={async () => {
              if (reducedFields.length > 0) {
                await addCondition({
                  andIndex: 0,
                  field: reducedFields.find((field) => !field.field.admin?.disableListFilter),
                  orIndex: conditions.length,
                  relation: 'or',
                })
              }
            }}
          >
            {t('general:addFilter')}
          </Button>
        </div>
      )}
    </div>
  )
}
