'use client'

import type { EditViewProps } from 'payload'

import React from 'react'

import { ChevronIcon } from '../../../../icons/Chevron/index.js'
import { ExternalLinkIcon } from '../../../../icons/ExternalLink/index.js'
import { XIcon } from '../../../../icons/X/index.js'
import { useLivePreviewContext } from '../../../../providers/LivePreview/context.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import { Popup, PopupList } from '../../../Popup/index.js'
import { PreviewFrameSizeInput } from '../SizeInput/index.js'
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
    <div className="flex items-center gap-[calc(var(--base)/3)] [&_.popup-button]:flex [&_.popup-button]:items-center">
      {breakpoints?.length > 0 && (
        <Popup
          button={
            <React.Fragment>
              <span>
                {breakpoints.find((bp) => bp.name == breakpoint)?.label ?? customOption.label}
              </span>
              <ChevronIcon />
            </React.Fragment>
          }
          className="border-none bg-transparent h-(--base) focus:outline-none"
          horizontalAlign="right"
          render={({ close }) => (
            <PopupList.ButtonGroup>
              <React.Fragment>
                {breakpoints.map((bp) => (
                  <PopupList.Button
                    active={bp.name == breakpoint}
                    key={bp.name}
                    onClick={() => {
                      setBreakpoint(bp.name)
                      close()
                    }}
                  >
                    {bp.label}
                  </PopupList.Button>
                ))}
                {/* Dynamically add this option so that it only appears when the width and height inputs are explicitly changed */}
                {breakpoint === 'custom' && (
                  <PopupList.Button
                    active={breakpoint == customOption.value}
                    onClick={() => {
                      setBreakpoint(customOption.value)
                      close()
                    }}
                  >
                    {customOption.label}
                  </PopupList.Button>
                )}
              </React.Fragment>
            </PopupList.ButtonGroup>
          )}
          showScrollbar
          verticalAlign="bottom"
        />
      )}
      <div className="flex items-center">
        <PreviewFrameSizeInput axis="x" />
        <span>
          <XIcon />
        </span>
        <PreviewFrameSizeInput axis="y" />
      </div>
      <Popup
        button={
          <React.Fragment>
            <span>{zoom * 100}%</span>
            <ChevronIcon />
          </React.Fragment>
        }
        className="w-[55px] border-none bg-transparent h-(--base) focus:outline-none"
        horizontalAlign="right"
        render={({ close }) => (
          <PopupList.ButtonGroup>
            <React.Fragment>
              {zoomOptions.map((zoomValue) => (
                <PopupList.Button
                  active={zoom * 100 == zoomValue}
                  key={zoomValue}
                  onClick={() => {
                    setZoom(zoomValue / 100)
                    close()
                  }}
                >
                  {zoomValue}%
                </PopupList.Button>
              ))}
            </React.Fragment>
          </PopupList.ButtonGroup>
        )}
        showScrollbar
        verticalAlign="bottom"
      />
      <a
        className="shrink-0 flex size-(--base) items-center justify-center py-1.5 px-0"
        href={url}
        onClick={(e) => {
          e.preventDefault()
          setPreviewWindowType('popup')
        }}
        target="_blank"
        title="Open in new window"
        type="button"
      >
        <ExternalLinkIcon />
      </a>
    </div>
  )
}
