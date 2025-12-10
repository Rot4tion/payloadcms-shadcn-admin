// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import { useWindowInfo } from '@payloadcms/ui'
import { isImage } from 'payload/shared'
import React from 'react'
import { useModal } from '../../Modal'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useConfig, useTranslation } from '@payloadcms/ui'
import { ChevronDownIcon, ChevronUpIcon, XIcon } from 'lucide-react'
import { SelectInput } from '../../../fields/Select/Input'
import { AnimateHeight } from '../../AnimateHeight'
import { Drawer } from '../../Drawer'
import { ErrorPill } from '../../ErrorPill'
import { Pill } from '../../Pill'
import { ShimmerEffect } from '../../ShimmerEffect'
import { createThumbnail } from '../../Thumbnail/createThumbnail'
import { Thumbnail } from '../../Thumbnail'
import { Actions } from '../ActionsBar'
import { AddFilesView } from '../AddFilesView'
import { useFormsManager } from '../FormsManager'
import { useBulkUpload } from '..'

const addMoreFilesDrawerSlug = 'bulk-upload-drawer--add-more-files'

export function FileSidebar() {
  const {
    activeIndex,
    addFiles,
    forms,
    isInitializing,
    removeFile,
    setActiveIndex,
    totalErrorCount,
  } = useFormsManager()
  const { initialFiles, initialForms, maxFiles } = useBulkUpload()
  const { i18n, t } = useTranslation()
  const { closeModal, openModal } = useModal()
  const [showFiles, setShowFiles] = React.useState(false)
  const { breakpoints } = useWindowInfo()

  const handleRemoveFile = React.useCallback(
    (indexToRemove: number) => {
      removeFile(indexToRemove)
    },
    [removeFile],
  )

  const handleAddFiles = React.useCallback(
    (filelist: FileList) => {
      void addFiles(filelist)
      closeModal(addMoreFilesDrawerSlug)
    },
    [addFiles, closeModal],
  )

  const getFileSize = React.useCallback((file: File) => {
    const size = file.size
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
    const decimals = i > 1 ? 1 : 0
    const formattedSize =
      (size / Math.pow(1024, i)).toFixed(decimals) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
    return formattedSize
  }, [])

  const totalFileCount = isInitializing
    ? (initialFiles?.length ?? initialForms?.length)
    : forms.length

  const {
    collectionSlug: bulkUploadCollectionSlug,
    selectableCollections,
    setCollectionSlug,
  } = useBulkUpload()

  const { getEntityConfig } = useConfig()

  return (
    <div
      className={cn(
        'border-r border-border p-0 flex flex-col w-[300px] overflow-visible max-h-full',
        'max-lg:flex-col-reverse max-lg:w-full max-lg:sticky max-lg:bottom-0 max-lg:shrink-0',
        showFiles && 'max-lg:z-2',
      )}
    >
      {breakpoints.m && showFiles ? (
        <div
          className={cn(
            'fixed top-0 left-0 w-full h-full transition-opacity duration-100 backdrop-blur-sm bg-background/80',
            showFiles ? 'opacity-100' : 'opacity-0',
          )}
        />
      ) : null}
      <div className="sticky top-0 mt-(--base) z-1 flex items-center justify-between w-full bg-background flex-wrap max-lg:mt-0 [&_p]:m-0">
        {/* @ts-expect-error */}
        {selectableCollections?.length > 1 && (
          <SelectInput
            className="w-full [&_.react-select]:w-full [&_.field-type\_\_wrap]:w-full [&_.field-type\_\_wrap]:py-(--base) [&_.field-type\_\_wrap]:px-[calc(var(--gutter-h)/4)]"
            isClearable={false}
            name="groupBy"
            onChange={(e) => {
              const val: string =
                typeof e === 'object' && 'value' in e
                  ? (e?.value as string)
                  : (e as unknown as string)
              setCollectionSlug(val)
            }}
            options={
              selectableCollections?.map((coll) => {
                const config = getEntityConfig({ collectionSlug: coll })
                return { label: config.labels.singular, value: config.slug }
              }) || []
            }
            path="groupBy"
            required
            value={bulkUploadCollectionSlug}
          />
        )}
        <div className="flex items-center justify-between gap-(--base) w-full py-(--base) px-[calc(var(--gutter-h)/4)] max-lg:border-t max-lg:border-border max-lg:py-0 max-lg:pb-[calc(var(--base)*0.8)]">
          <div className="flex flex-col max-lg:hidden [&_.error-pill]:self-start">
            {/* @ts-expect-error */}
            <ErrorPill count={totalErrorCount} i18n={i18n} withMessage />
            <p>
              <strong
                title={`${totalFileCount} ${t(totalFileCount > 1 ? 'upload:filesToUpload' : 'upload:fileToUpload')}`}
              >
                {totalFileCount}{' '}
                {t(totalFileCount > 1 ? 'upload:filesToUpload' : 'upload:fileToUpload')}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-(--base) max-lg:grow max-lg:justify-end">
            {(typeof maxFiles === 'number' ? totalFileCount < maxFiles : true) ? (
              <Pill
                className="h-fit"
                onClick={() => openModal(addMoreFilesDrawerSlug)}
                size="small"
              >
                {t('upload:addFile')}
              </Pill>
            ) : null}
            <Button
              variant="ghost"
              className="hidden m-0 py-0 px-0 pt-[calc(var(--base)*0.8)] pb-[calc(var(--base)*0.8)] max-lg:flex max-lg:justify-end max-lg:grow [&_.btn\_\_label]:w-full [&_.btn\_\_label]:flex [&_.btn\_\_label]:items-center [&_.btn\_\_label]:justify-between [&_svg]:max-w-6"
              onClick={() => setShowFiles((prev) => !prev)}
            >
              <span className="hidden max-lg:flex">
                <strong
                  title={`${totalFileCount} ${t(totalFileCount > 1 ? 'upload:filesToUpload' : 'upload:fileToUpload')}`}
                >
                  {totalFileCount}{' '}
                  {t(totalFileCount > 1 ? 'upload:filesToUpload' : 'upload:fileToUpload')}
                </strong>
              </span>
              {showFiles ? (
                <ChevronDownIcon className="size-4" />
              ) : (
                <ChevronUpIcon className="size-4" />
              )}
            </Button>

            <Drawer gutter={false} Header={null} slug={addMoreFilesDrawerSlug}>
              <AddFilesView
                onCancel={() => closeModal(addMoreFilesDrawerSlug)}
                onDrop={handleAddFiles}
              />
            </Drawer>
          </div>
        </div>

        <div className="hidden relative w-full py-[calc(var(--base)*0.8)] px-(--gutter-h) border-t border-border max-lg:flex [&>div]:flex [&>div]:justify-end [&>div]:w-full [&>div_button]:flex-[0.5]">
          <Actions />
        </div>
      </div>

      <div className="overflow-auto">
        <AnimateHeight height={!breakpoints.m || showFiles ? 'auto' : 0}>
          <div className="flex flex-col gap-[calc(var(--base)/4)] mt-[calc(var(--base)/2)] w-full px-[calc(var(--gutter-h)/4)] max-lg:px-(--gutter-h) max-lg:backdrop-blur-sm max-lg:bg-background/80 [&_.shimmer-effect]:rounded-md">
            {isInitializing &&
            forms.length === 0 &&
            (initialFiles?.length > 0 || initialForms?.length > 0)
              ? (initialFiles ? Array.from(initialFiles) : initialForms).map((file, index) => (
                  <ShimmerEffect
                    animationDelay={`calc(${index} * ${60}ms)`}
                    height="35px"
                    key={index}
                  />
                ))
              : null}
            {forms.map(({ errorCount, formID, formState }, index) => {
              const currentFile = (formState?.file?.value as File) || ({} as File)
              const isActive = index === activeIndex
              const hasError = errorCount && errorCount > 0

              return (
                <div
                  className={cn(
                    'relative last:mb-[calc(var(--base)/4)] max-lg:z-1',
                    isActive && '[&_button:first-child]:bg-muted [&_.icon--x]:opacity-100',
                    hasError && '[&_button:first-child]:bg-destructive/10',
                    hasError && isActive && '[&_button:first-child]:bg-destructive/20',
                    hasError && '[&_button:first-child:hover]:bg-destructive/20',
                  )}
                  key={formID}
                >
                  <button
                    className="bg-transparent border-0 m-0 cursor-pointer flex p-[calc(var(--base)/4)] items-center gap-[calc(var(--base)/2)] rounded-md max-w-full w-full hover:bg-muted [&_p]:m-0"
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  >
                    <SidebarThumbnail file={currentFile} formID={formID} />
                    <div className="flex flex-col min-w-0">
                      <p
                        className="whitespace-nowrap overflow-hidden text-ellipsis"
                        title={currentFile.name}
                      >
                        {currentFile.name || t('upload:noFile')}
                      </p>
                    </div>
                    {currentFile instanceof File ? (
                      <p className="text-[calc(var(--base)/2)] text-muted-foreground shrink-0">
                        {getFileSize(currentFile)}
                      </p>
                    ) : null}
                    <div className="bg-transparent border-0 p-0 m-0 ml-auto pointer-events-none opacity-0 [&_.icon--x]:opacity-75">
                      <XIcon className="size-4" />
                    </div>

                    {errorCount ? (
                      <ErrorPill
                        className="ml-auto absolute translate-x-1/2 -translate-y-1/2 top-0 right-0"
                        count={errorCount}
                        i18n={i18n}
                      />
                    ) : null}
                  </button>

                  <button
                    aria-label={t('general:remove')}
                    className="bg-transparent border-0 p-0 m-0 ml-auto absolute -translate-y-1/2 top-1/2 bottom-1/2 right-[calc(var(--base)/4)] h-5 rounded-md cursor-pointer hover:bg-accent [&_.icon--x]:opacity-75"
                    onClick={() => handleRemoveFile(index)}
                    type="button"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </AnimateHeight>
      </div>
    </div>
  )
}

const thumbnailClasses =
  'w-[calc(var(--base)*1.2)] h-[calc(var(--base)*1.2)] rounded-sm shrink-0 object-cover'

function SidebarThumbnail({ file, formID }: { file: File; formID: string }) {
  const [thumbnailURL, setThumbnailURL] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isCancelled = false

    async function generateThumbnail() {
      setIsLoading(true)
      setThumbnailURL(null)

      try {
        if (isImage(file.type)) {
          const url = await createThumbnail(file)
          if (!isCancelled) {
            setThumbnailURL(url)
          }
        } else {
          setThumbnailURL(null)
        }
      } catch (_) {
        if (!isCancelled) {
          setThumbnailURL(null)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void generateThumbnail()

    return () => {
      isCancelled = true
    }
  }, [file])

  if (isLoading) {
    return <ShimmerEffect className={thumbnailClasses} disableInlineStyles />
  }

  return (
    <Thumbnail
      className={thumbnailClasses}
      fileSrc={thumbnailURL ?? undefined}
      key={`${formID}-${thumbnailURL || 'placeholder'}`}
    />
  )
}
