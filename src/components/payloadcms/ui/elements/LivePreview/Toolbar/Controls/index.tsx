'use client'

import type { EditViewProps } from 'payload'

import React from 'react'

import { ExternalLinkIcon } from '../../../../icons/ExternalLink'
import { useLivePreviewContext, useTranslation } from '@payloadcms/ui'
import { PreviewFrameSizeInput } from '../SizeInput'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, X } from 'lucide-react'

const zoomOptions = [50, 75, 100, 125, 150, 200]

export const ToolbarControls: React.FC<EditViewProps> = () => {
  const { breakpoint, breakpoints, setBreakpoint, setPreviewWindowType, setZoom, url, zoom } =
    useLivePreviewContext()

  const { t } = useTranslation()

  const customOption = {
    label: t('general:custom'),
    value: 'custom',
  }

  return (
    <div className="flex items-center gap-[calc(var(--base)/3)]">
      {/* Breakpoint Selector */}
      {breakpoints && breakpoints.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-(--base) gap-1 px-2 text-(length:--base-body-size)"
            >
              <span>
                {breakpoints.find((bp) => bp.name === breakpoint)?.label ?? customOption.label}
              </span>
              <ChevronDown className="size-(--base)" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {breakpoints.map((bp) => (
              <DropdownMenuItem
                key={bp.name}
                onClick={() => setBreakpoint(bp.name)}
                className={bp.name === breakpoint ? 'bg-accent' : ''}
              >
                {bp.label}
              </DropdownMenuItem>
            ))}
            {breakpoint === 'custom' && (
              <DropdownMenuItem
                onClick={() => setBreakpoint(customOption.value)}
                className={breakpoint === customOption.value ? 'bg-accent' : ''}
              >
                {customOption.label}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Size Inputs */}
      <div className="flex items-center">
        <PreviewFrameSizeInput axis="x" />
        <X className="size-(--base) text-muted-foreground mx-0.5" />
        <PreviewFrameSizeInput axis="y" />
      </div>

      {/* Zoom Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-(--base) gap-1 px-2 text-(length:--base-body-size) min-w-[55px]"
          >
            <span>{zoom ? zoom * 100 : 100}%</span>
            <ChevronDown className="size-(--base)" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {zoomOptions.map((zoomValue) => (
            <DropdownMenuItem
              key={zoomValue}
              onClick={() => setZoom(zoomValue / 100)}
              className={zoom && zoom * 100 === zoomValue ? 'bg-accent' : ''}
            >
              {zoomValue}%
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Open in New Window */}
      <Button
        variant="ghost"
        size="icon"
        className="size-(--base) shrink-0"
        onClick={(e) => {
          e.preventDefault()
          setPreviewWindowType('popup')
        }}
        title="Open in new window"
      >
        <ExternalLinkIcon />
      </Button>
    </div>
  )
}
