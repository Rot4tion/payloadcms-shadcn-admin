'use client'
import type { FormState, SanitizedCollectionConfig, UploadEdits } from 'payload'

import { useModal } from '../Modal/index'
import { isImage } from 'payload/shared'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { FieldError } from '../../fields/FieldError/index'
import { fieldBaseClass } from '../../fields/shared/index'
import { useForm, useFormProcessing } from '../../forms/Form/index'
import { useField } from '../../forms/useField/index'
import { useConfig } from '@payloadcms/ui'
import { useDocumentInfo } from '@payloadcms/ui'
import { EditDepthProvider } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { UploadControlsProvider, useUploadControls } from '../../providers/UploadControls/index'
import { useUploadEdits } from '../../providers/UploadEdits/index'
import { Button } from '../Button/index'
import { Drawer } from '../Drawer/index'
import { Dropzone } from '../Dropzone/index'
import { EditUpload } from '../EditUpload/index'
import { FileDetails } from '../FileDetails/index'
import { PreviewSizes } from '../PreviewSizes/index'
import { Thumbnail } from '../Thumbnail/index'

export const editDrawerSlug = 'edit-upload'
export const sizePreviewSlug = 'preview-sizes'

const validate = (value) => {
  if (!value && value !== undefined) {
    return 'A file is required.'
  }

  if (value && (!value.name || value.name === '')) {
    return 'A file name is required.'
  }

  return true
}

type UploadActionsArgs = {
  readonly customActions?: React.ReactNode[]
  readonly enableAdjustments: boolean
  readonly enablePreviewSizes: boolean
  readonly mimeType: string
}

export const UploadActions = ({
  customActions,
  enableAdjustments,
  enablePreviewSizes,
  mimeType,
}: UploadActionsArgs) => {
  const { t } = useTranslation()
  const { openModal } = useModal()

  const fileTypeIsAdjustable =
    isImage(mimeType) && mimeType !== 'image/svg+xml' && mimeType !== 'image/jxl'

  if (!fileTypeIsAdjustable && (!customActions || customActions.length === 0)) {
    return null
  }

  return (
    <div className="flex gap-[calc(var(--base)/2)] flex-wrap mt-[calc(var(--base)*0.5)]">
      {fileTypeIsAdjustable && (
        <React.Fragment>
          {enablePreviewSizes && (
            <Button
              buttonStyle="pill"
              className=""
              margin={false}
              onClick={() => {
                openModal(sizePreviewSlug)
              }}
              size="small"
            >
              {t('upload:previewSizes')}
            </Button>
          )}
          {enableAdjustments && (
            <Button
              buttonStyle="pill"
              className="max-md:hidden"
              margin={false}
              onClick={() => {
                openModal(editDrawerSlug)
              }}
              size="small"
            >
              {t('upload:editImage')}
            </Button>
          )}
        </React.Fragment>
      )}

      {customActions &&
        customActions.map((CustomAction, i) => {
          return <React.Fragment key={i}>{CustomAction}</React.Fragment>
        })}
    </div>
  )
}

export type UploadProps = {
  readonly collectionSlug: string
  readonly customActions?: React.ReactNode[]
  readonly initialState?: FormState
  readonly onChange?: (file?: File) => void
  readonly uploadConfig: SanitizedCollectionConfig['upload']
  readonly UploadControls?: React.ReactNode
}

export const Upload: React.FC<UploadProps> = (props) => {
  const { resetUploadEdits, updateUploadEdits, uploadEdits } = useUploadEdits()
  return (
    <UploadControlsProvider>
      <Upload_v4
        {...props}
        resetUploadEdits={resetUploadEdits}
        updateUploadEdits={updateUploadEdits}
        uploadEdits={uploadEdits}
      />
    </UploadControlsProvider>
  )
}

export type UploadProps_v4 = {
  readonly resetUploadEdits?: () => void
  readonly updateUploadEdits?: (args: UploadEdits) => void
  readonly uploadEdits?: UploadEdits
} & UploadProps

export const Upload_v4: React.FC<UploadProps_v4> = (props) => {
  const {
    collectionSlug,
    customActions,
    initialState,
    onChange,
    resetUploadEdits,
    updateUploadEdits,
    uploadConfig,
    UploadControls,
    uploadEdits,
  } = props

  const {
    setUploadControlFile,
    setUploadControlFileName,
    setUploadControlFileUrl,
    uploadControlFile,
    uploadControlFileName,
    uploadControlFileUrl,
  } = useUploadControls()

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const { t } = useTranslation()
  const { setModified } = useForm()
  const { id, data, docPermissions, setUploadStatus } = useDocumentInfo()
  const isFormSubmitting = useFormProcessing()
  const { errorMessage, setValue, showError, value } = useField<File>({
    path: 'file',
    validate,
  })

  const [fileSrc, setFileSrc] = useState<null | string>(null)
  const [removedFile, setRemovedFile] = useState(false)
  const [filename, setFilename] = useState<string>(value?.name || '')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [fileUrl, setFileUrl] = useState<string>('')

  const urlInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const useServerSideFetch =
    typeof uploadConfig?.pasteURL === 'object' && uploadConfig.pasteURL.allowList?.length > 0

  const handleFileChange = useCallback(
    ({ file, isNewFile = true }: { file: File | null; isNewFile?: boolean }) => {
      if (isNewFile && file instanceof File) {
        setFileSrc(URL.createObjectURL(file))
      }

      setValue(file)
      setShowUrlInput(false)
      setUploadControlFileUrl('')
      setUploadControlFileName(null)
      setUploadControlFile(null)

      if (typeof onChange === 'function') {
        onChange(file)
      }
    },
    [onChange, setValue, setUploadControlFile, setUploadControlFileName, setUploadControlFileUrl],
  )

  const renameFile = (fileToChange: File, newName: string): File => {
    // Creating a new File object with updated properties
    const newFile = new File([fileToChange], newName, {
      type: fileToChange.type,
      lastModified: fileToChange.lastModified,
    })
    return newFile
  }

  const handleFileNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedFileName = e.target.value

      if (value) {
        handleFileChange({ file: renameFile(value, updatedFileName), isNewFile: false })
        setFilename(updatedFileName)
      }
    },
    [handleFileChange, value],
  )

  const handleFileSelection = useCallback(
    (files: FileList) => {
      const fileToUpload = files?.[0]
      handleFileChange({ file: fileToUpload })
    },
    [handleFileChange],
  )

  const handleFileRemoval = useCallback(() => {
    setRemovedFile(true)
    handleFileChange({ file: null })
    setFileSrc('')
    setFileUrl('')
    resetUploadEdits()
    setShowUrlInput(false)
    setUploadControlFileUrl('')
    setUploadControlFileName(null)
    setUploadControlFile(null)
  }, [
    handleFileChange,
    resetUploadEdits,
    setUploadControlFile,
    setUploadControlFileName,
    setUploadControlFileUrl,
  ])

  const onEditsSave = useCallback(
    (args: UploadEdits) => {
      setModified(true)
      updateUploadEdits(args)
    },
    [setModified, updateUploadEdits],
  )

  const handleUrlSubmit = useCallback(async () => {
    if (!fileUrl || uploadConfig?.pasteURL === false) {
      return
    }

    setUploadStatus('uploading')
    try {
      // Attempt client-side fetch
      const clientResponse = await fetch(fileUrl)

      if (!clientResponse.ok) {
        throw new Error(`Fetch failed with status: ${clientResponse.status}`)
      }

      const blob = await clientResponse.blob()
      const fileName = uploadControlFileName || decodeURIComponent(fileUrl.split('/').pop() || '')
      const file = new File([blob], fileName, { type: blob.type })

      handleFileChange({ file })
      setUploadStatus('idle')
      return // Exit if client-side fetch succeeds
    } catch (_clientError) {
      if (!useServerSideFetch) {
        // If server-side fetch is not enabled, show client-side error
        toast.error('Failed to fetch the file.')
        setUploadStatus('failed')
        return
      }
    }

    // Attempt server-side fetch if client-side fetch fails and useServerSideFetch is true
    try {
      const pasteURL = `/${collectionSlug}/paste-url${id ? `/${id}?` : '?'}src=${encodeURIComponent(fileUrl)}`
      const serverResponse = await fetch(`${serverURL}${api}${pasteURL}`)

      if (!serverResponse.ok) {
        throw new Error(`Fetch failed with status: ${serverResponse.status}`)
      }

      const blob = await serverResponse.blob()
      const fileName = decodeURIComponent(fileUrl.split('/').pop() || '')
      const file = new File([blob], fileName, { type: blob.type })

      handleFileChange({ file })
      setUploadStatus('idle')
    } catch (_serverError) {
      toast.error('The provided URL is not allowed.')
      setUploadStatus('failed')
    }
  }, [
    api,
    collectionSlug,
    fileUrl,
    handleFileChange,
    id,
    serverURL,
    setUploadStatus,
    uploadConfig,
    uploadControlFileName,
    useServerSideFetch,
  ])

  useEffect(() => {
    if (initialState?.file?.value instanceof File) {
      setFileSrc(URL.createObjectURL(initialState.file.value))
      setRemovedFile(false)
    }
  }, [initialState])

  useEffect(() => {
    if (showUrlInput && urlInputRef.current) {
      // urlInputRef.current.focus() // Focus on the remote-url input field when showUrlInput is true
    }
  }, [showUrlInput])

  useEffect(() => {
    if (isFormSubmitting) {
      setRemovedFile(false)
    }
  }, [isFormSubmitting])

  const canRemoveUpload = docPermissions?.update

  const hasImageSizes = uploadConfig?.imageSizes?.length > 0
  const hasResizeOptions = Boolean(uploadConfig?.resizeOptions)
  // Explicity check if set to true, default is undefined
  const focalPointEnabled = uploadConfig?.focalPoint === true

  const { crop: showCrop = true, focalPoint = true } = uploadConfig

  const showFocalPoint = focalPoint && (hasImageSizes || hasResizeOptions || focalPointEnabled)

  const acceptMimeTypes = uploadConfig.mimeTypes?.join(', ')

  const imageCacheTag = uploadConfig?.cacheTags && data?.updatedAt

  useEffect(() => {
    const handleControlFileUrl = async () => {
      if (uploadControlFileUrl) {
        setFileUrl(uploadControlFileUrl)
        await handleUrlSubmit()
      }
    }

    void handleControlFileUrl()
  }, [uploadControlFileUrl, handleUrlSubmit])

  useEffect(() => {
    const handleControlFile = () => {
      if (uploadControlFile) {
        handleFileChange({ file: uploadControlFile })
      }
    }

    void handleControlFile()
  }, [uploadControlFile, handleFileChange])

  return (
    <div className={`${fieldBaseClass} relative mb-(--base) bg-muted/50 rounded-sm`}>
      <FieldError message={errorMessage} showError={showError} />
      {data && data.filename && !removedFile && (
        <FileDetails
          collectionSlug={collectionSlug}
          customUploadActions={customActions}
          doc={data}
          enableAdjustments={showCrop || showFocalPoint}
          handleRemove={canRemoveUpload ? handleFileRemoval : undefined}
          hasImageSizes={hasImageSizes}
          hideRemoveFile={uploadConfig.hideRemoveFile}
          imageCacheTag={imageCacheTag}
          uploadConfig={uploadConfig}
        />
      )}
      {((!uploadConfig.hideFileInputOnCreate && !data?.filename) || removedFile) && (
        <div className="flex max-md:flex-wrap max-md:justify-between">
          {!value && !showUrlInput && (
            <Dropzone onChange={handleFileSelection}>
              <div className="flex flex-wrap gap-[calc(var(--base)*0.4)] justify-between w-full">
                <div className="flex gap-[calc(var(--base)*0.5)] items-center">
                  <Button
                    buttonStyle="pill"
                    onClick={() => {
                      if (inputRef.current) {
                        inputRef.current.click()
                      }
                    }}
                    size="small"
                  >
                    {t('upload:selectFile')}
                  </Button>
                  <input
                    accept={acceptMimeTypes}
                    aria-hidden="true"
                    className="hidden"
                    hidden
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileSelection(e.target.files)
                      }
                    }}
                    ref={inputRef}
                    type="file"
                  />
                  {uploadConfig?.pasteURL !== false && (
                    <Fragment>
                      <span className="text-muted-foreground lowercase">{t('general:or')}</span>
                      <Button
                        buttonStyle="pill"
                        onClick={() => {
                          setShowUrlInput(true)
                          setUploadControlFileUrl('')
                          setUploadControlFile(null)
                          setUploadControlFileName(null)
                        }}
                        size="small"
                      >
                        {t('upload:pasteURL')}
                      </Button>
                    </Fragment>
                  )}

                  {UploadControls ? UploadControls : null}
                </div>
                <p className="shrink-0 m-0 lowercase self-center text-muted-foreground">
                  {t('general:or')} {t('upload:dragAndDrop')}
                </p>
              </div>
            </Dropzone>
          )}
          {showUrlInput && (
            <React.Fragment>
              <div className="p-(--base) w-full flex flex-col gap-[calc(var(--base)/2)]">
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <input
                  className="bg-background border border-border rounded-sm p-[calc(var(--base)*0.5)] w-full"
                  onChange={(e) => {
                    setFileUrl(e.target.value)
                  }}
                  ref={urlInputRef}
                  title={fileUrl}
                  type="text"
                  value={fileUrl}
                />
                <div className="flex gap-[calc(var(--base)/2)] flex-wrap">
                  <button
                    className="bg-primary text-primary-foreground px-3 py-1 rounded-sm cursor-pointer border-none"
                    onClick={() => {
                      void handleUrlSubmit()
                    }}
                    type="button"
                  >
                    {t('upload:addFile')}
                  </button>
                </div>
              </div>
              <Button
                buttonStyle="icon-label"
                className="m-[calc(var(--base)*1.5)] mr-(--base) mb-(--base) self-start max-md:m-(--base) max-md:order-2"
                icon="x"
                iconStyle="with-border"
                onClick={() => {
                  setShowUrlInput(false)
                  setUploadControlFileUrl('')
                  setUploadControlFile(null)
                  setUploadControlFileName(null)
                }}
                round
                tooltip={t('general:cancel')}
              />
            </React.Fragment>
          )}
          {value && fileSrc && (
            <React.Fragment>
              <div className="relative w-[150px] max-md:order-1 max-md:w-1/2 [&_.thumbnail]:relative [&_.thumbnail]:w-full [&_.thumbnail]:h-full [&_.thumbnail]:object-contain [&_.thumbnail]:rounded-l-sm">
                <Thumbnail
                  collectionSlug={collectionSlug}
                  fileSrc={isImage(value.type) ? fileSrc : null}
                />
              </div>
              <div className="p-(--base) w-full flex flex-col gap-[calc(var(--base)/2)] max-md:order-3 max-md:border-t-2 max-md:border-background max-md:p-[calc(var(--base)*0.5)] max-md:gap-0">
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <input
                  className="bg-background border border-border rounded-sm p-[calc(var(--base)*0.5)] w-full"
                  onChange={handleFileNameChange}
                  title={filename || value.name}
                  type="text"
                  value={filename || value.name}
                />
                <UploadActions
                  customActions={customActions}
                  enableAdjustments={showCrop || showFocalPoint}
                  enablePreviewSizes={hasImageSizes && data?.filename && !removedFile}
                  mimeType={value.type}
                />
              </div>
              <Button
                buttonStyle="icon-label"
                className="m-[calc(var(--base)*1.5)] mr-(--base) mb-(--base) self-start max-md:m-(--base) max-md:order-2"
                icon="x"
                iconStyle="with-border"
                onClick={handleFileRemoval}
                round
                tooltip={t('general:cancel')}
              />
            </React.Fragment>
          )}
        </div>
      )}
      {(value || data?.filename) && (
        <EditDepthProvider>
          <Drawer Header={null} slug={editDrawerSlug}>
            <EditUpload
              fileName={value?.name || data?.filename}
              fileSrc={data?.url || fileSrc}
              imageCacheTag={imageCacheTag}
              initialCrop={uploadEdits?.crop ?? undefined}
              initialFocalPoint={{
                x: uploadEdits?.focalPoint?.x || data?.focalX || 50,
                y: uploadEdits?.focalPoint?.y || data?.focalY || 50,
              }}
              onSave={onEditsSave}
              showCrop={showCrop}
              showFocalPoint={showFocalPoint}
            />
          </Drawer>
        </EditDepthProvider>
      )}
      {data && hasImageSizes && (
        <Drawer
          className="[&_h2]:m-0 [&_h2]:mr-(--base) [&_h2]:whitespace-nowrap [&_h2]:overflow-hidden [&_h2]:text-ellipsis [&_h2]:max-w-[calc(100%-var(--base)*2)]"
          hoverTitle
          slug={sizePreviewSlug}
          title={t('upload:sizesFor', { label: data.filename })}
        >
          <PreviewSizes doc={data} imageCacheTag={imageCacheTag} uploadConfig={uploadConfig} />
        </Drawer>
      )}
    </div>
  )
}
