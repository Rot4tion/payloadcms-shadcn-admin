'use client'
import React, { useState } from 'react'

import type { DragHandleProps } from '../DraggableSortable/DraggableSortableItem/types.js'

import { cn } from '@/lib/utils'
import { ChevronIcon } from '../../icons/Chevron/index.js'
import { DragHandleIcon } from '../../icons/DragHandle/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { AnimateHeight } from '../AnimateHeight/index.js'
import { CollapsibleProvider, useCollapsible } from './provider.js'

export { CollapsibleProvider, useCollapsible }

export type CollapsibleProps = {
  actions?: React.ReactNode
  /**
   * Components that will be rendered within the collapsible provider but after the wrapper.
   */
  AfterCollapsible?: React.ReactNode
  children: React.ReactNode
  className?: string
  collapsibleStyle?: 'default' | 'error'
  /**
   * If set to true, clicking on the collapsible header will not toggle the collapsible state.
   * This is useful if the collapsible state is controlled externally (e.g. from a parent component or custom button).
   */
  disableHeaderToggle?: boolean
  /**
   * If set to true, the toggle indicator (chevron) on the right side of the header will be hidden.
   */
  disableToggleIndicator?: boolean
  dragHandleProps?: DragHandleProps
  header?: React.ReactNode
  initCollapsed?: boolean
  isCollapsed?: boolean
  onToggle?: (collapsed: boolean) => Promise<void> | void
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  actions,
  AfterCollapsible,
  children,
  className,
  collapsibleStyle = 'default',
  disableHeaderToggle = false,
  disableToggleIndicator = false,
  dragHandleProps,
  header,
  initCollapsed,
  isCollapsed: collapsedFromProps,
  onToggle,
}) => {
  const [collapsedLocal, setCollapsedLocal] = useState(Boolean(initCollapsed))
  const [hoveringToggle, setHoveringToggle] = useState(false)
  const { isWithinCollapsible } = useCollapsible()
  const { t } = useTranslation()

  const isCollapsed = typeof collapsedFromProps === 'boolean' ? collapsedFromProps : collapsedLocal

  const toggleCollapsible = React.useCallback(() => {
    if (typeof onToggle === 'function') {
      void onToggle(!isCollapsed)
    }
    setCollapsedLocal(!isCollapsed)
  }, [onToggle, isCollapsed])

  return (
    <div
      className={cn(
        'collapsible relative rounded-md',
        // Style variants
        collapsibleStyle === 'default' && 'border border-border hover:border-muted-foreground/50',
        collapsibleStyle === 'error' && 'border border-destructive',
        // State variants
        isWithinCollapsible && 'nested',
        className,
      )}
    >
      <CollapsibleProvider isCollapsed={isCollapsed} toggle={toggleCollapsible}>
        <div
          className={cn(
            'relative flex w-full items-center justify-between gap-1 rounded-t-md px-3 py-2',
            collapsibleStyle === 'default' && 'bg-muted/50 hover:bg-muted',
            collapsibleStyle === 'error' && 'bg-destructive/10 hover:bg-destructive/20',
            isCollapsed && 'rounded-b-md',
            dragHandleProps && 'pl-2',
          )}
          onMouseEnter={() => setHoveringToggle(true)}
          onMouseLeave={() => setHoveringToggle(false)}
        >
          {dragHandleProps && (
            <div
              className="flex size-5 cursor-grab items-center justify-center opacity-50 hover:opacity-100"
              {...dragHandleProps.attributes}
              {...dragHandleProps.listeners}
            >
              <DragHandleIcon />
            </div>
          )}

          {/* Clickable header area */}
          {!disableHeaderToggle ? (
            <button
              className="flex flex-1 cursor-pointer items-center text-left"
              onClick={toggleCollapsible}
              type="button"
            >
              <span className="sr-only">{t('fields:toggleBlock')}</span>
              {header && <div className="pointer-events-none flex-1 overflow-hidden">{header}</div>}
            </button>
          ) : (
            header && <div className="flex-1 overflow-hidden">{header}</div>
          )}

          <div className="flex items-center gap-1">
            {actions && <div className="flex items-center">{actions}</div>}
            {!disableToggleIndicator && (
              <div className="flex size-5 items-center justify-center">
                <ChevronIcon direction={!isCollapsed ? 'up' : undefined} />
              </div>
            )}
          </div>
        </div>
        <AnimateHeight height={isCollapsed ? 0 : 'auto'}>
          <div className="rounded-b-md bg-background p-4">{children}</div>
        </AnimateHeight>
        {AfterCollapsible}
      </CollapsibleProvider>
    </div>
  )
}
