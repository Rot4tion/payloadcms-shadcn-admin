'use client'

import type { UploadEdits } from 'payload'

import { useModal } from '../Modal/index'
import React, { useRef, useState } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import { cn } from '@/lib/utils'
import { editDrawerSlug } from '../../elements/Upload/index'
import { PlusIcon } from '../../icons/Plus/index'
import { useTranslation } from '@payloadcms/ui'
import { Button } from '../Button/index'

type Props = {
  name: string
  onChange: (value: string) => void
  ref?: React.RefObject<HTMLInputElement>
  value: string
}

const Input: React.FC<Props> = (props) => {
  const { name, onChange, ref, value } = props

  return (
    <div className="flex-1">
      {name}
      <input
        className="w-full border border-input bg-background rounded-md px-3 py-2"
        name={name}
        onChange={(e) => onChange(e.target.value)}
        ref={ref}
        type="number"
        value={value}
      />
    </div>
  )
}

type FocalPosition = {
  x: number
  y: number
}

export type EditUploadProps = {
  fileName: string
  fileSrc: string
  imageCacheTag?: string
  initialCrop?: UploadEdits['crop']
  initialFocalPoint?: FocalPosition
  onSave?: (uploadEdits: UploadEdits) => void
  showCrop?: boolean
  showFocalPoint?: boolean
}

const defaultCrop: UploadEdits['crop'] = {
  height: 100,
  unit: '%',
  width: 100,
  x: 0,
  y: 0,
}

export const EditUpload: React.FC<EditUploadProps> = ({
  fileName,
  fileSrc,
  imageCacheTag,
  initialCrop,
  initialFocalPoint,
  onSave,
  showCrop,
  showFocalPoint,
}) => {
  const { closeModal } = useModal()
  const { t } = useTranslation()

  const [crop, setCrop] = useState<UploadEdits['crop']>(() => ({
    ...defaultCrop,
    ...(initialCrop || {}),
  }))

  const defaultFocalPosition: FocalPosition = {
    x: 50,
    y: 50,
  }

  const [focalPosition, setFocalPosition] = useState<FocalPosition>(() => ({
    ...defaultFocalPosition,
    ...initialFocalPoint,
  }))

  const [checkBounds, setCheckBounds] = useState<boolean>(false)
  const [uncroppedPixelHeight, setUncroppedPixelHeight] = useState<number>(0)
  const [uncroppedPixelWidth, setUncroppedPixelWidth] = useState<number>(0)

  const focalWrapRef = useRef<HTMLDivElement | undefined>(undefined)
  const imageRef = useRef<HTMLImageElement | undefined>(undefined)
  const cropRef = useRef<HTMLDivElement | undefined>(undefined)

  const heightInputRef = useRef<HTMLInputElement | null>(null)
  const widthInputRef = useRef<HTMLInputElement | null>(null)

  const [imageLoaded, setImageLoaded] = useState<boolean>(false)

  const onImageLoad = (e) => {
    // set the default image height/width on load
    setUncroppedPixelHeight(e.currentTarget.naturalHeight)
    setUncroppedPixelWidth(e.currentTarget.naturalWidth)
    setImageLoaded(true)
  }

  const fineTuneCrop = ({ dimension, value }: { dimension: 'height' | 'width'; value: string }) => {
    const intValue = parseInt(value)
    if (dimension === 'width' && intValue >= uncroppedPixelWidth) {
      return null
    }
    if (dimension === 'height' && intValue >= uncroppedPixelHeight) {
      return null
    }

    const percentage =
      100 * (intValue / (dimension === 'width' ? uncroppedPixelWidth : uncroppedPixelHeight))

    if (percentage === 100 || percentage === 0) {
      return null
    }

    setCrop({
      ...crop,
      [dimension]: percentage,
    })
  }

  const fineTuneFocalPosition = ({
    coordinate,
    value,
  }: {
    coordinate: 'x' | 'y'
    value: string
  }) => {
    const intValue = parseInt(value)
    if (intValue >= 0 && intValue <= 100) {
      setFocalPosition((prevPosition) => ({ ...prevPosition, [coordinate]: intValue }))
    }
  }

  const saveEdits = () => {
    if (typeof onSave === 'function') {
      onSave({
        crop: crop ? crop : undefined,
        focalPoint: focalPosition,
        heightInPixels: Number(heightInputRef?.current?.value ?? uncroppedPixelHeight),
        widthInPixels: Number(widthInputRef?.current?.value ?? uncroppedPixelWidth),
      })
    }
    closeModal(editDrawerSlug)
  }

  const onDragEnd = React.useCallback(({ x, y }) => {
    setFocalPosition({ x, y })
    setCheckBounds(false)
  }, [])

  const centerFocalPoint = () => {
    const containerRect = focalWrapRef.current.getBoundingClientRect()
    const boundsRect = showCrop
      ? cropRef.current.getBoundingClientRect()
      : imageRef.current.getBoundingClientRect()
    const xCenter =
      ((boundsRect.left - containerRect.left + boundsRect.width / 2) / containerRect.width) * 100
    const yCenter =
      ((boundsRect.top - containerRect.top + boundsRect.height / 2) / containerRect.height) * 100
    setFocalPosition({ x: xCenter, y: yCenter })
  }

  const fileSrcToUse = imageCacheTag ? `${fileSrc}?${encodeURIComponent(imageCacheTag)}` : fileSrc

  return (
    <div className="h-full -mx-[var(--gutter-h)] [--edit-upload-cell-spacing:calc(var(--base)*1.5)] [--edit-upload-sidebar-width:calc(350px+var(--gutter-h))] max-lg:[--edit-upload-cell-spacing:var(--gutter-h)] max-md:flex-col">
      <div className="h-[calc(var(--base)*5)] border-b border-border px-[var(--gutter-h)] flex justify-between items-center">
        <h2
          className="m-0 whitespace-nowrap overflow-hidden text-ellipsis"
          title={`${t('general:editing')} ${fileName}`}
        >
          {t('general:editing')} {fileName}
        </h2>
        <div className="min-w-[350px] ml-auto rtl:mr-auto rtl:ml-0 py-[calc(var(--base)*0.5)] pl-[calc(var(--base)*1.5)] rtl:pr-[calc(var(--base)*1.5)] rtl:pl-0 justify-end flex gap-[var(--base)] whitespace-nowrap">
          <Button
            aria-label={t('general:cancel')}
            buttonStyle="secondary"
            onClick={() => closeModal(editDrawerSlug)}
          >
            {t('general:cancel')}
          </Button>
          <Button
            aria-label={t('general:applyChanges')}
            buttonStyle="primary"
            disabled={!imageLoaded}
            onClick={saveEdits}
          >
            {t('general:applyChanges')}
          </Button>
        </div>
      </div>
      <div className="flex justify-end h-[calc(100%-calc(var(--base)*5))] max-lg:flex-col-reverse">
        <div className="p-[var(--edit-upload-cell-spacing)] pl-[var(--gutter-h)] flex items-start h-full">
          <div
            className="relative inline-flex max-h-full"
            ref={focalWrapRef}
            style={{
              aspectRatio: `${uncroppedPixelWidth / uncroppedPixelHeight}`,
            }}
          >
            {showCrop ? (
              <ReactCrop
                crop={crop}
                onChange={(_, c) => setCrop(c)}
                onComplete={() => setCheckBounds(true)}
                renderSelectionAddon={() => {
                  return <div className="h-full w-full" ref={cropRef} />
                }}
              >
                <img
                  alt={t('upload:setCropArea')}
                  onLoad={onImageLoad}
                  ref={imageRef}
                  src={fileSrcToUse}
                />
              </ReactCrop>
            ) : (
              <img
                alt={t('upload:setFocalPoint')}
                onLoad={onImageLoad}
                ref={imageRef}
                src={fileSrcToUse}
              />
            )}
            {showFocalPoint && (
              <DraggableElement
                boundsRef={showCrop ? cropRef : imageRef}
                checkBounds={showCrop ? checkBounds : false}
                className="absolute top-1/2 left-1/2 rounded-full flex items-center justify-center cursor-grab w-[50px] h-[50px] -translate-x-1/2 -translate-y-1/2 pointer-events-auto [&_svg]:absolute [&_svg]:inset-0 [&_svg]:bg-black/50 [&_svg]:rounded-full [&_svg]:w-[calc(var(--base)*2)] [&_svg]:h-[calc(var(--base)*2)] [&_svg]:text-white"
                containerRef={focalWrapRef}
                initialPosition={focalPosition}
                onDragEnd={onDragEnd}
                setCheckBounds={showCrop ? setCheckBounds : false}
              >
                <PlusIcon />
              </DraggableElement>
            )}
          </div>
        </div>
        {(showCrop || showFocalPoint) && (
          <div className="border-l border-border pt-[var(--edit-upload-cell-spacing)] min-w-[var(--edit-upload-sidebar-width)] [&>div:first-child]:mb-[var(--base)] max-lg:pl-0 max-lg:border-l-0 max-lg:w-full max-md:min-w-0">
            {showCrop && (
              <div className="flex flex-col gap-[calc(var(--base)*0.5)] pr-[var(--gutter-h)] pl-[var(--edit-upload-cell-spacing)] w-full [&+div]:pt-[var(--edit-upload-cell-spacing)] [&+div]:mt-[var(--edit-upload-cell-spacing)] [&+div]:border-t [&+div]:border-border">
                <div>
                  <div className="flex gap-[var(--base)] justify-between items-center">
                    <h3 className="m-0">{t('upload:crop')}</h3>
                    <Button
                      buttonStyle="none"
                      className="h-fit rounded-sm bg-muted px-[calc(var(--base)*0.4)]"
                      onClick={() =>
                        setCrop({
                          height: 100,
                          unit: '%',
                          width: 100,
                          x: 0,
                          y: 0,
                        })
                      }
                    >
                      {t('general:reset')}
                    </Button>
                  </div>
                </div>
                <span className="text-muted-foreground">{t('upload:cropToolDescription')}</span>
                <div className="flex gap-[var(--base)] max-md:flex-col">
                  <Input
                    name={`${t('upload:width')} (px)`}
                    onChange={(value) => fineTuneCrop({ dimension: 'width', value })}
                    ref={widthInputRef}
                    value={((crop.width / 100) * uncroppedPixelWidth).toFixed(0)}
                  />
                  <Input
                    name={`${t('upload:height')} (px)`}
                    onChange={(value) => fineTuneCrop({ dimension: 'height', value })}
                    ref={heightInputRef}
                    value={((crop.height / 100) * uncroppedPixelHeight).toFixed(0)}
                  />
                </div>
              </div>
            )}

            {showFocalPoint && (
              <div className="flex flex-col gap-[calc(var(--base)*0.5)] pr-[var(--gutter-h)] pl-[var(--edit-upload-cell-spacing)] w-full [&+div]:pt-[var(--edit-upload-cell-spacing)] [&+div]:mt-[var(--edit-upload-cell-spacing)] [&+div]:border-t [&+div]:border-border">
                <div>
                  <div className="flex gap-[var(--base)] justify-between items-center">
                    <h3 className="m-0">{t('upload:focalPoint')}</h3>
                    <Button
                      buttonStyle="none"
                      className="h-fit rounded-sm bg-muted px-[calc(var(--base)*0.4)]"
                      onClick={centerFocalPoint}
                    >
                      {t('general:reset')}
                    </Button>
                  </div>
                </div>
                <span className="text-muted-foreground">{t('upload:focalPointDescription')}</span>
                <div className="flex gap-[var(--base)] max-md:flex-col">
                  <Input
                    name="X %"
                    onChange={(value) => fineTuneFocalPosition({ coordinate: 'x', value })}
                    value={focalPosition.x.toFixed(0)}
                  />
                  <Input
                    name="Y %"
                    onChange={(value) => fineTuneFocalPosition({ coordinate: 'y', value })}
                    value={focalPosition.y.toFixed(0)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const DraggableElement = ({
  boundsRef,
  checkBounds,
  children,
  className,
  containerRef,
  initialPosition = { x: 50, y: 50 },
  onDragEnd,
  setCheckBounds,
}: {
  boundsRef: React.RefObject<HTMLElement | undefined>
  checkBounds: boolean
  children: React.ReactNode
  className?: string
  containerRef: React.RefObject<HTMLElement | undefined>
  initialPosition?: { x: number; y: number }
  onDragEnd: (position: { x: number; y: number }) => void
  setCheckBounds: React.Dispatch<React.SetStateAction<boolean>> | false
}) => {
  const [position, setPosition] = useState({ x: initialPosition.x, y: initialPosition.y })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLButtonElement | undefined>(undefined)

  const getCoordinates = React.useCallback(
    (mouseXArg?: number, mouseYArg?: number, recenter?: boolean) => {
      const containerRect = containerRef.current.getBoundingClientRect()
      const boundsRect = boundsRef.current.getBoundingClientRect()
      const mouseX = mouseXArg ?? boundsRect.left
      const mouseY = mouseYArg ?? boundsRect.top

      const xOutOfBounds = mouseX < boundsRect.left || mouseX > boundsRect.right
      const yOutOfBounds = mouseY < boundsRect.top || mouseY > boundsRect.bottom

      let x = ((mouseX - containerRect.left) / containerRect.width) * 100
      let y = ((mouseY - containerRect.top) / containerRect.height) * 100
      const xCenter =
        ((boundsRect.left - containerRect.left + boundsRect.width / 2) / containerRect.width) * 100
      const yCenter =
        ((boundsRect.top - containerRect.top + boundsRect.height / 2) / containerRect.height) * 100
      if (xOutOfBounds || yOutOfBounds) {
        setIsDragging(false)
        if (mouseX < boundsRect.left) {
          x = ((boundsRect.left - containerRect.left) / containerRect.width) * 100
        } else if (mouseX > boundsRect.right) {
          x =
            ((containerRect.width - (containerRect.right - boundsRect.right)) /
              containerRect.width) *
            100
        }

        if (mouseY < boundsRect.top) {
          y = ((boundsRect.top - containerRect.top) / containerRect.height) * 100
        } else if (mouseY > boundsRect.bottom) {
          y =
            ((containerRect.height - (containerRect.bottom - boundsRect.bottom)) /
              containerRect.height) *
            100
        }

        if (recenter) {
          x = xOutOfBounds ? xCenter : x
          y = yOutOfBounds ? yCenter : y
        }
      }

      return { x, y }
    },
    [boundsRef, containerRef],
  )

  const handleMouseDown = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleMouseMove = (event) => {
    if (!isDragging) {
      return null
    }
    const { x, y } = getCoordinates(event.clientX, event.clientY)

    setPosition({ x, y })
  }

  const onDrop = () => {
    setIsDragging(false)
    onDragEnd(position)
  }

  React.useEffect(() => {
    if (isDragging || !dragRef.current) {
      return
    }
    if (checkBounds) {
      const { height, left, top, width } = dragRef.current.getBoundingClientRect()
      const { x, y } = getCoordinates(left + width / 2, top + height / 2, true)
      onDragEnd({ x, y })
      setPosition({ x, y })
      setCheckBounds(false)
      return
    }
  }, [getCoordinates, isDragging, checkBounds, setCheckBounds, position.x, position.y, onDragEnd])

  React.useEffect(() => {
    setPosition({ x: initialPosition.x, y: initialPosition.y })
  }, [initialPosition.x, initialPosition.y])

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none',
        isDragging && 'pointer-events-auto [&_.focal-point]:cursor-grabbing',
      )}
      onMouseMove={handleMouseMove}
    >
      <button
        className={cn(
          'bg-transparent border-0 p-0 m-0 cursor-pointer absolute focal-point',
          className,
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={onDrop}
        ref={dragRef}
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
        type="button"
      >
        {children}
      </button>
      <div />
    </div>
  )
}
