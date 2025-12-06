/**
 * Re-export Form from @payloadcms/ui to share context
 * Form component uses internal contexts that cannot be easily customized
 */
'use client'

export {
  FormContext,
  FormFieldsContext,
  ModifiedContext,
  ProcessingContext,
  SubmittedContext,
  DocumentFormContext,
} from '@payloadcms/ui/forms/Form'

export { Form } from '@payloadcms/ui'
export type { FormProps } from '@payloadcms/ui'

// Re-export all context and hooks
export {
  useForm,
  useFormFields,
  useFormModified,
  useFormProcessing,
  useFormSubmitted,
  useWatchForm,
  useAllFormFields,
  useDocumentForm,
} from '@payloadcms/ui'

// FormWatchContext is not exported from main entry, use sub-path
export { FormWatchContext } from '@payloadcms/ui/forms/Form'
