'use client'
import { ChevronIcon } from '@payloadcms-local/ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

const chars = {
  leftCurlyBracket: '\u007B',
  leftSquareBracket: '\u005B',
  rightCurlyBracket: '\u007D',
  rightSquareBracket: '\u005D',
}

const Bracket = ({
  type,
  comma = false,
  position,
}: {
  comma?: boolean
  position: 'end' | 'start'
  type: 'array' | 'object'
}) => {
  const rightBracket = type === 'object' ? chars.rightCurlyBracket : chars.rightSquareBracket
  const leftBracket = type === 'object' ? chars.leftCurlyBracket : chars.leftSquareBracket
  const bracketToRender = position === 'end' ? rightBracket : leftBracket

  return (
    <span
      className={cn(
        'relative',
        type === 'array' && 'text-yellow-300',
        type === 'object' && 'text-yellow-300',
      )}
    >
      {bracketToRender}
      {position === 'end' && comma ? ',' : null}
    </span>
  )
}

// Color classes for different JSON value types
const valueTypeColors: Record<string, string> = {
  string: 'text-green-500',
  number: 'text-amber-500',
  boolean: 'text-sky-500',
  null: 'text-rose-500',
  date: 'text-purple-500',
}

type Args = {
  isEmpty?: boolean
  isRoot?: boolean
  object: any[] | Record<string, any>
  objectKey?: string
  parentType?: 'array' | 'object'
  trailingComma?: boolean
}

export const RenderJSON = ({
  isEmpty = false,
  isRoot = false,
  object,
  objectKey,
  parentType = 'object',
  trailingComma = false,
}: Args) => {
  const objectKeys = object ? Object.keys(object) : []
  const objectLength = objectKeys.length
  const [isOpen, setIsOpen] = React.useState<boolean>(true)

  return (
    <li className="list-none">
      <div className="flex items-start">
        {/* Toggle button - fixed width column */}
        <button
          aria-label="toggle"
          className={cn(
            'bg-transparent border-0 p-0 m-0 cursor-pointer shrink-0 w-5 flex items-center justify-center',
            '[&_svg_.stroke]:stroke-muted-foreground hover:opacity-70',
            isEmpty && 'cursor-default pointer-events-none',
          )}
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          {isEmpty ? null : (
            <ChevronIcon
              className={cn('size-4 transition-transform', isOpen ? 'rotate-0' : '-rotate-90')}
            />
          )}
        </button>
        {/* Content */}
        <span>
          {objectKey && <span className="text-sky-300">{`"${objectKey}"`}</span>}
          {objectKey && <span className="text-foreground">{`: `}</span>}
          <Bracket position="start" type={parentType} />
          {isEmpty && <Bracket comma={trailingComma} position="end" type={parentType} />}
        </span>
      </div>

      {!isEmpty && isOpen && (
        <ul className="m-0 pl-5 border-l border-dashed border-border ml-2.5">
          {objectKeys.map((key, keyIndex) => {
            let value = object[key]
            let type = 'string'
            const isLastKey = keyIndex === objectLength - 1

            if (value === null) {
              type = 'null'
            } else if (value instanceof Date) {
              type = 'date'
              value = value.toISOString()
            } else if (Array.isArray(value)) {
              type = 'array'
            } else if (typeof value === 'object') {
              type = 'object'
            } else if (typeof value === 'number') {
              type = 'number'
            } else if (typeof value === 'boolean') {
              type = 'boolean'
            } else {
              type = 'string'
            }

            if (type === 'object' || type === 'array') {
              return (
                <RenderJSON
                  isEmpty={value.length === 0 || Object.keys(value).length === 0}
                  key={`${key}-${keyIndex}`}
                  object={value}
                  objectKey={parentType === 'object' ? key : undefined}
                  parentType={type}
                  trailingComma={!isLastKey}
                />
              )
            }

            // Primitive values
            const parentHasKey = Boolean(parentType === 'object' && key)

            return (
              <li className="list-none flex items-start" key={`${key}-${keyIndex}`}>
                <span className="w-5 shrink-0" />
                <span>
                  {parentHasKey && <span className="text-sky-300">{`"${key}"`}</span>}
                  {parentHasKey && <span className="text-foreground">{`: `}</span>}
                  <span className={valueTypeColors[type] || 'text-foreground'}>
                    {JSON.stringify(value)}
                  </span>
                  {isLastKey ? '' : ','}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {!isEmpty && (
        <div className="flex items-start">
          <span className="w-5 shrink-0" />
          <Bracket comma={trailingComma} position="end" type={parentType} />
        </div>
      )}
    </li>
  )
}
