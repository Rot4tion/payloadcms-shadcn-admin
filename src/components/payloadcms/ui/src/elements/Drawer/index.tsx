'use client'
import React, { createContext, use, useCallback } from 'react'

import type { Props, TogglerProps } from './types.js'

import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useTranslation } from '../../providers/Translation/index.js'
import { Gutter } from '../Gutter/index.js'
import { useModal } from '../Modal/index.js'

export const drawerZBase = 100

export const formatDrawerSlug = ({ slug, depth }: { depth: number; slug: string }): string =>
  `drawer_${depth}_${slug}`

export { useDrawerSlug } from './useDrawerSlug.js'

export const DrawerToggler: React.FC<TogglerProps> = ({
  slug,
  children,
  className,
  disabled,
  onClick,
  ...rest
}) => {
  const { openModal } = useModal()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      openModal(slug)
      if (typeof onClick === 'function') {
        onClick(e)
      }
    },
    [openModal, slug, onClick],
  )

  return (
    <button
      className={cn('inline-flex items-center justify-center', className)}
      disabled={disabled}
      onClick={handleClick}
      type="button"
      {...rest}
    >
      {children}
    </button>
  )
}

export const Drawer: React.FC<Props> = ({
  slug,
  children,
  className,
  gutter = true,
  Header,
  hideDefaultCloseButton,
  hoverTitle,
  title,
}) => {
  const { t } = useTranslation()
  const { closeModal, modalState } = useModal()
  const drawerDepth = useDrawerDepth()

  const isOpen = !!modalState[slug]?.isOpen

  if (!isOpen) {
    return null
  }

  // Calculate width based on depth for nested drawers
  const widthOffset = drawerDepth * 24 // ~1.5rem per depth level

  return (
    <DrawerDepthProvider>
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeModal(slug)}>
        <SheetContent
          className={cn(
            'flex flex-col overflow-hidden p-0 w-full sm:max-w-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
            'duration-200',
            // Hide default close button when custom Header is provided or explicitly requested
            (Header || hideDefaultCloseButton) && '[&>button.absolute]:hidden',
            className,
          )}
          style={{
            zIndex: drawerZBase + drawerDepth,
            width: `calc(100% - ${widthOffset}px)`,
            maxWidth: drawerDepth > 1 ? `calc(100% - ${widthOffset}px)` : undefined,
          }}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          aria-describedby={undefined}
        >
          {/* Blur background for first level */}
          {(!drawerDepth || drawerDepth === 1) && (
            <div className="absolute inset-0 -z-10 backdrop-blur-sm bg-background/95" />
          )}

          <Gutter
            className="relative z-10 flex-1 overflow-auto h-full"
            left={gutter}
            right={gutter}
          >
            {/* Hidden title for accessibility when custom Header is provided */}
            {Header !== undefined && (
              <SheetTitle className="sr-only">{title || 'Drawer'}</SheetTitle>
            )}
            {Header}
            {Header === undefined && (
              <SheetHeader className="flex flex-row items-center justify-between mt-10 mb-4 p-0 space-y-0">
                <SheetTitle
                  className="grow m-0 text-xl font-semibold"
                  title={hoverTitle ? title : undefined}
                >
                  {title}
                </SheetTitle>
                {/* Close button is provided by SheetContent - no custom button needed */}
              </SheetHeader>
            )}
            {children}
          </Gutter>
        </SheetContent>
      </Sheet>
    </DrawerDepthProvider>
  )
}

export const DrawerDepthContext = createContext(1)

export const DrawerDepthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const parentDepth = useDrawerDepth()
  const depth = parentDepth + 1

  return <DrawerDepthContext value={depth}>{children}</DrawerDepthContext>
}

export const useDrawerDepth = (): number => use(DrawerDepthContext)
