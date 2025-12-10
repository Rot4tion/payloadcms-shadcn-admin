'use client'

import React, { useCallback, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Re-export provider and hook from PayloadCMS
export { CollapsibleProvider, useCollapsible } from '@payloadcms/ui/elements/Collapsible'

// Custom Collapsible Component with Shadcn UI styling
export type CollapsibleProps = {
  children: React.ReactNode
  className?: string
  collapsibleStyle?: 'default' | 'error'
  header: React.ReactNode
  initCollapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  className,
  collapsibleStyle = 'default',
  header,
  initCollapsed = false,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(!initCollapsed)

  const handleToggle = useCallback(() => {
    const newState = !isOpen
    setIsOpen(newState)
    onToggle?.(!newState)
  }, [isOpen, onToggle])

  return (
    <div
      className={cn(
        'collapsible rounded-md! border! border-border/40! bg-card/50! overflow-hidden!',
        collapsibleStyle === 'error' &&
          'collapsible--error border-destructive/50! bg-destructive/5!',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex! w-full! items-center! justify-between! gap-3! px-4! py-3!',
          'bg-muted/40! hover:bg-muted/60! transition-colors! duration-150!',
          'text-sm! font-medium! text-foreground! cursor-pointer! border-none! text-left!',
          'focus-visible:outline-none! focus-visible:ring-2! focus-visible:ring-ring!',
          collapsibleStyle === 'error' &&
            'bg-destructive/10! hover:bg-destructive/15! text-destructive!',
        )}
        aria-expanded={isOpen}
      >
        <div className="flex-1! text-left!">{header}</div>
        <ChevronDown
          className={cn(
            'size-4! shrink-0! text-muted-foreground! transition-transform! duration-200!',
            isOpen && 'rotate-180!',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4! py-3! border-t! border-border/30!">{children}</div>
        </div>
      </div>
    </div>
  )
}
