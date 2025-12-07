/**
 * Re-export from @payloadcms/ui to share context
 */
'use client'

export {
  BackgroundProcessingContext,
  useFormInitializing,
} from 'node_modules/@payloadcms/ui/dist/forms/Form/context'

export { InitializingContext } from 'node_modules/@payloadcms/ui/dist/forms/Form/context'

export { useFormBackgroundProcessing } from '@payloadcms/ui'

export {
  DocumentFormContext,
  FormContext,
  FormFieldsContext,
  FormWatchContext,
  ModifiedContext,
  ProcessingContext,
  SubmittedContext,
  useAllFormFields,
  useDocumentForm,
  useForm,
  useFormFields,
  useFormModified,
  useFormProcessing,
  useFormSubmitted,
  useWatchForm,
} from '@payloadcms/ui/forms/Form'
