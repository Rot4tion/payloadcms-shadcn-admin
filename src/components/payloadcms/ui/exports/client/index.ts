/* eslint-disable perfectionist/sort-exports */
'use client'

// IMPORTANT: this file cannot use any wildcard exports because it is wrapped in a `use client` boundary
// IMPORTANT: do _not_ alias any of the exports in this file, this will cause a mismatch between the unbundled exports

// hooks

export { fieldComponents } from '../../fields'

export { useDebounce } from '../../hooks/useDebounce'
export { useDebouncedCallback } from '../../hooks/useDebouncedCallback'
export { useDebouncedEffect } from '../../hooks/useDebouncedEffect'
export { useDelay } from '../../hooks/useDelay'
export { useDelayedRender } from '../../hooks/useDelayedRender'
export { useHotkey } from '../../hooks/useHotkey'
export { useIntersect } from '../../hooks/useIntersect'
export { usePayloadAPI } from '../../hooks/usePayloadAPI'
export { useResize } from '../../hooks/useResize'
export { useThrottledEffect } from '../../hooks/useThrottledEffect'
export { useEffectEvent } from '../../hooks/useEffectEvent'
export { FieldPathContext, useFieldPath } from '../../forms/RenderFields/context'
export { useQueue } from '../../hooks/useQueue'

export { useUseTitleField } from '../../hooks/useUseAsTitle'

export { SortHeader } from '../../elements/SortHeader'
export { SortRow } from '../../elements/SortRow'
export { OrderableTable } from '../../elements/Table/OrderableTable'

// query preset elements
export { QueryPresetsColumnsCell } from '../../elements/QueryPresets/cells/ColumnsCell'
export { QueryPresetsWhereCell } from '../../elements/QueryPresets/cells/WhereCell'
export { QueryPresetsAccessCell } from '../../elements/QueryPresets/cells/AccessCell'
export { QueryPresetsColumnField } from '../../elements/QueryPresets/fields/ColumnsField'
export { QueryPresetsWhereField } from '../../elements/QueryPresets/fields/WhereField'

// elements
export { ConfirmationModal } from '../../elements/ConfirmationModal'
export type { OnCancel } from '../../elements/ConfirmationModal'
export { Link } from '../../elements/Link'
export { LeaveWithoutSaving } from '../../elements/LeaveWithoutSaving'
export { DocumentTakeOver } from '../../elements/DocumentTakeOver'
export { DocumentLocked } from '../../elements/DocumentLocked'
export { TableColumnsProvider, useTableColumns } from '@payloadcms/ui'
export { RenderDefaultCell, useCellProps } from '../../providers/TableColumns/RenderDefaultCell'
export { DateCell } from '../../elements/Table/DefaultCell/fields/Date'

export { Translation } from '../../elements/Translation'
export { default as DatePicker } from '../../elements/DatePicker/DatePicker'
export { ViewDescription } from '../../elements/ViewDescription'
export { AppHeader } from '../../elements/AppHeader'
export { RenderCustomComponent } from '../../elements/RenderCustomComponent'
// BulkUpload - re-export from @payloadcms/ui for shared drawer context
export {
  BulkUploadDrawer,
  BulkUploadProvider,
  useBulkUpload,
  useBulkUploadDrawerSlug,
} from '@payloadcms/ui'
export { DrawerContentContainer } from '../../elements/DrawerContentContainer'
export type { BulkUploadProps } from '@payloadcms/ui'
export { Banner } from '../../elements/Banner'
export { Button } from '../../elements/Button'
export { AnimateHeight } from '../../elements/AnimateHeight'
export { PillSelector, type SelectablePill } from '../../elements/PillSelector'
export { Card } from '../../elements/Card'
export { Collapsible, useCollapsible } from '../../elements/Collapsible'
export { CopyLocaleData } from '../../elements/CopyLocaleData'
export { CopyToClipboard } from '../../elements/CopyToClipboard'
export { DeleteMany } from '../../elements/DeleteMany'
export { DocumentControls } from '../../elements/DocumentControls'
export { Dropzone } from '../../elements/Dropzone'
// Re-export from @payloadcms/ui for shared drawer context
export { documentDrawerBaseClass, useDocumentDrawer } from '@payloadcms/ui'
export { getHTMLDiffComponents } from '../../elements/HTMLDiff'
export type {
  DocumentDrawerProps,
  DocumentTogglerProps,
  UseDocumentDrawer,
} from '../../elements/DocumentDrawer/types'
export { useClickOutside } from '../../hooks/useClickOutside'
export { useClickOutsideContext } from '../../providers/ClickOutside'
export { useDocumentDrawerContext } from '../../elements/DocumentDrawer/Provider'
export { DocumentFields } from '../../elements/DocumentFields'
// Re-export from @payloadcms/ui for shared drawer context
export { Drawer, DrawerToggler, formatDrawerSlug, useDrawerSlug } from '@payloadcms/ui'
export { EditMany } from '../../elements/EditMany'
export { ErrorPill } from '../../elements/ErrorPill'
export { FullscreenModal } from '../../elements/FullscreenModal'
export { GenerateConfirmation } from '../../elements/GenerateConfirmation'
export { Gutter } from '../../elements/Gutter'
export { Hamburger } from '../../elements/Hamburger'
export { HydrateAuthProvider } from '../../elements/HydrateAuthProvider'
export { Locked } from '../../elements/Locked'
export { ListControls } from '../../elements/ListControls'
export { useListDrawer } from '@payloadcms/ui'
export type {
  ListDrawerProps,
  ListTogglerProps,
  RenderListServerFnArgs,
  RenderListServerFnReturnType,
  UseListDrawer,
} from '../../elements/ListDrawer/types'
export { ListSelection } from '../../views/List/ListSelection'
export { CollectionListHeader as ListHeader } from '../../views/List/ListHeader'
export { GroupByHeader } from '../../views/List/GroupByHeader'
export { PageControls, PageControlsComponent } from '../../elements/PageControls'
export { StickyToolbar } from '../../elements/StickyToolbar'

export { GroupByPageControls } from '../../elements/PageControls/GroupByPageControls'
export { LoadingOverlayToggle } from '../../elements/Loading'
export { FormLoadingOverlayToggle } from '../../elements/Loading'
export { LoadingOverlay } from '../../elements/Loading'
export { Logout } from '../../elements/Logout'
export { Modal, useModal } from '@payloadcms/ui'
export { NavToggler } from '../../elements/Nav/NavToggler'
export { NavContext, NavProvider, useNav } from '@payloadcms/ui'
export { NavGroup } from '../../elements/NavGroup'
export { Pagination } from '../../elements/Pagination'
export { PerPage } from '../../elements/PerPage'
export { Pill } from '../../elements/Pill'
import * as PopupList from '../../elements/Popup/PopupButtonList'
export { PopupList }
export { Popup } from '../../elements/Popup'
export { Combobox } from '../../elements/Combobox'
export type { ComboboxEntry, ComboboxProps } from '../../elements/Combobox'
export { PublishMany } from '../../elements/PublishMany'
export { PublishButton } from '../../elements/PublishButton'
export { SaveButton } from '../../elements/SaveButton'
export { SaveDraftButton } from '../../elements/SaveDraftButton'

// folder elements
export { FolderProvider, useFolder } from '@payloadcms/ui'
export { BrowseByFolderButton } from '../../elements/FolderView/BrowseByFolderButton'
export { FolderTypeField } from '../../elements/FolderView/FolderTypeField'
export { FolderFileTable } from '../../elements/FolderView/FolderFileTable'
export { ItemCardGrid } from '../../elements/FolderView/ItemCardGrid'

export { type Option as ReactSelectOption, ReactSelect } from '../../elements/ReactSelect'
export { ReactSelect as Select } from '../../elements/ReactSelect'
export { RenderTitle } from '../../elements/RenderTitle'
export { ShimmerEffect } from '../../elements/ShimmerEffect'
export { StaggeredShimmers } from '../../elements/ShimmerEffect'
export { SortColumn } from '../../elements/SortColumn'
export { SetStepNav } from '../../elements/StepNav/SetStepNav'
export { useStepNav } from '../../elements/StepNav'
export type { StepNavItem } from '../../elements/StepNav/types'
export {
  RelationshipProvider,
  useListRelationships,
} from '../../elements/Table/RelationshipProvider'
export { Table } from '../../elements/Table'
export { DefaultCell } from '../../elements/Table/DefaultCell'
export { Thumbnail } from '../../elements/Thumbnail'
export { Tooltip } from '../../elements/Tooltip'
import { toast } from 'sonner'
export { toast }
export { UnpublishMany } from '../../elements/UnpublishMany'
export { Upload } from '../../elements/Upload'
export { SearchFilter } from '../../elements/SearchFilter'
export { EditUpload } from '../../elements/EditUpload'
export { FileDetails } from '../../elements/FileDetails'
export { PreviewSizes } from '../../elements/PreviewSizes'
export { PreviewButton } from '../../elements/PreviewButton'
export { RelationshipTable } from '../../elements/RelationshipTable'
export { TimezonePicker } from '../../elements/TimezonePicker'
export { MoveDocToFolder, MoveDocToFolderButton } from '../../elements/FolderView/MoveDocToFolder'

export { BlocksDrawer } from '../../fields/Blocks/BlocksDrawer'
export { BlockSelector } from '../../fields/Blocks/BlockSelector'
export { SectionTitle } from '../../fields/Blocks/SectionTitle'

// fields
export { HiddenField } from '../../fields/Hidden'
export { ArrayField } from '../../fields/Array'
export { BlocksField } from '../../fields/Blocks'
export { CheckboxField, CheckboxInput } from '../../fields/Checkbox'
export { CodeField } from '../../fields/Code'
export { CodeEditor as CodeEditorLazy } from '../../elements/CodeEditor'
export { default as CodeEdiftor } from '../../elements/CodeEditor/CodeEditor'

export { CollapsibleField } from '../../fields/Collapsible'
export { ConfirmPasswordField } from '../../fields/ConfirmPassword'
export { DateTimeField } from '../../fields/DateTime'
export { EmailField } from '../../fields/Email'
export { FieldDescription } from '../../fields/FieldDescription'
export { FieldError } from '../../fields/FieldError'
export { FieldLabel } from '../../fields/FieldLabel'
export { GroupField } from '../../fields/Group'
export { JSONField } from '../../fields/JSON'
export { NumberField } from '../../fields/Number'
export { PasswordField } from '../../fields/Password'
export { PointField } from '../../fields/Point'
export { RadioGroupField } from '../../fields/RadioGroup'
export { RelationshipField, RelationshipInput } from '../../fields/Relationship'
export { RichTextField } from '../../fields/RichText'
export { RowField } from '../../fields/Row'
export { SelectField, SelectInput } from '../../fields/Select'
export { TabsField, TabsProvider } from '../../fields/Tabs'
export { TabComponent } from '../../fields/Tabs/Tab'
export { SlugField } from '../../fields/Slug'

export { TextField, TextInput } from '../../fields/Text'
export { JoinField } from '../../fields/Join'
export type { TextInputProps } from '../../fields/Text'
export { allFieldComponents } from '../../fields'

export { TextareaField, TextareaInput } from '../../fields/Textarea'
export type { TextAreaInputProps } from '../../fields/Textarea'

export { UIField } from '../../fields/UI'
export { UploadField, UploadInput } from '../../fields/Upload'
export type { UploadInputProps } from '../../fields/Upload'

export { fieldBaseClass } from '../../fields/shared'

// forms

export {
  useAllFormFields,
  useDocumentForm,
  useForm,
  useFormBackgroundProcessing,
  useFormFields,
  useFormInitializing,
  useFormModified,
  useFormProcessing,
  useFormSubmitted,
  useWatchForm,
} from '../../forms/Form/context'
export { Form, type FormProps } from '../../forms/Form'
export type { FieldAction } from '../../forms/Form/types'
export { fieldReducer } from '../../forms/Form/fieldReducer'
export { NullifyLocaleField } from '../../forms/NullifyField'
export { RenderFields } from '../../forms/RenderFields'

export { RowLabel, type RowLabelProps } from '../../forms/RowLabel'
export { RowLabelProvider, useRowLabel } from '@payloadcms/ui'

export { FormSubmit } from '../../forms/Submit'
export { WatchChildErrors } from '../../forms/WatchChildErrors'
export { FieldContext, useField } from '../../forms/useField'
export type { FieldType, Options } from '../../forms/useField/types'

export { withCondition } from '../../forms/withCondition'
export { WatchCondition } from '../../forms/withCondition/WatchCondition'

// graphics
export { Account } from '../../graphics/Account'
export { PayloadIcon } from '../../graphics/Icon'

export { DefaultBlockImage } from '../../graphics/DefaultBlockImage'
export { File } from '../../graphics/File'

// icons
export { CalendarIcon } from '../../icons/Calendar'
export { CheckIcon } from '../../icons/Check'
export { ChevronIcon } from '../../icons/Chevron'
export { CloseMenuIcon } from '../../icons/CloseMenu'
export { CodeBlockIcon } from '../../icons/CodeBlock'
export { CopyIcon } from '../../icons/Copy'
export { DragHandleIcon } from '../../icons/DragHandle'
export { EditIcon } from '../../icons/Edit'
export { ExternalLinkIcon } from '../../icons/ExternalLink'
export { LineIcon } from '../../icons/Line'
export { LinkIcon } from '../../icons/Link'
export { LogOutIcon } from '../../icons/LogOut'
export { MenuIcon } from '../../icons/Menu'
export { MinimizeMaximizeIcon } from '../../icons/MinimizeMaximize'
export { MoreIcon } from '../../icons/More'
export { PlusIcon } from '../../icons/Plus'
export { SearchIcon } from '../../icons/Search'
export { SwapIcon } from '../../icons/Swap'
export { XIcon } from '../../icons/X'
export { FolderIcon } from '../../icons/Folder'
export { GearIcon } from '../../icons/Gear'
export { DocumentIcon } from '../../icons/Document'
export { MoveFolderIcon } from '../../icons/MoveFolder'
export { GridViewIcon } from '../../icons/GridView'
export { ListViewIcon } from '../../icons/ListView'

export { Error as ErrorIcon } from '../../providers/ToastContainer/icons/Error'
export { Info as InfoIcon } from '../../providers/ToastContainer/icons/Info'
export { Success as SuccessIcon } from '../../providers/ToastContainer/icons/Success'
export { Warning as WarningIcon } from '../../providers/ToastContainer/icons/Warning'

// providers - re-export from @payloadcms/ui for shared context
export {
  type RenderDocumentResult,
  type RenderDocumentServerFunction,
  ServerFunctionsContext,
  type ServerFunctionsContextType,
  ServerFunctionsProvider,
  useServerFunctions,
} from '@payloadcms/ui'
// ====================================================================
// PROVIDERS: Re-export from @payloadcms/ui to share context with Lexical
// This is CRITICAL for RichText/Lexical editor to work correctly
// ====================================================================
export {
  ActionsProvider,
  useActions,
  AuthProvider,
  useAuth,
  ClientFunctionProvider,
  useClientFunctions,
  useAddClientFunction,
  LivePreviewProvider,
  RouteTransitionProvider,
  useRouteTransition,
  ConfigProvider,
  PageConfigProvider,
  useConfig,
  DocumentEventsProvider,
  useDocumentEvents,
  DocumentInfoProvider,
  useDocumentInfo,
  useDocumentTitle,
  useUploadControls,
  EditDepthProvider,
  useEditDepth,
  EntityVisibilityProvider,
  useEntityVisibility,
  UploadEditsProvider,
  useUploadEdits,
  ListDrawerContextProvider,
  useListDrawerContext,
  ListQueryProvider,
  useListQuery,
  LocaleProvider,
  useLocale,
  OperationProvider,
  useOperation,
  ParamsProvider,
  useParams,
  PreferencesProvider,
  usePreferences,
  RootProvider,
  RouteCacheProvider,
  useRouteCache,
  ScrollInfoProvider,
  useScrollInfo,
  SearchParamsProvider,
  useSearchParams,
  SelectionProvider,
  useSelection,
  UploadHandlersProvider,
  useUploadHandlers,
  defaultTheme,
  ThemeProvider,
  useTheme,
  TranslationProvider,
  useTranslation,
  useWindowInfo,
  WindowInfoProvider,
} from '@payloadcms/ui'
export type {
  Theme,
  UserWithToken,
  DocumentInfoContext,
  DocumentInfoProps,
  UploadHandlersContext,
} from '@payloadcms/ui'

// Re-export ProgressBar from local (UI component, not context)
export { ProgressBar } from '../../providers/RouteTransition/ProgressBar'
export { useControllableState } from '../../hooks/useControllableState'

export { Text as TextCondition } from '../../elements/WhereBuilder/Condition/Text'
export { Select as SelectCondition } from '../../elements/WhereBuilder/Condition/Select'
export { RelationshipFilter as RelationshipCondition } from '../../elements/WhereBuilder/Condition/Relationship'
export { NumberFilter as NumberCondition } from '../../elements/WhereBuilder/Condition/Number'
export { DateFilter as DateCondition } from '../../elements/WhereBuilder/Condition/Date'
export { EmailAndUsernameFields } from '../../elements/EmailAndUsername'
export { SelectAll } from '../../elements/SelectAll'
export { SelectRow } from '../../elements/SelectRow'
export { SelectMany } from '../../elements/SelectMany'

export { DefaultListView } from '../../views/List'
export { DefaultCollectionFolderView } from '../../views/CollectionFolder'
export { DefaultBrowseByFolderView } from '../../views/BrowseByFolder'

export type { ListHeaderProps } from '../../views/List/ListHeader'

export { DefaultEditView } from '../../views/Edit'
export { SetDocumentStepNav } from '../../views/Edit/SetDocumentStepNav'
export { SetDocumentTitle } from '../../views/Edit/SetDocumentTitle'

export { parseSearchParams } from '../../utilities/parseSearchParams'
export { FieldDiffLabel } from '../../elements/FieldDiffLabel'
export { FieldDiffContainer } from '../../elements/FieldDiffContainer'
export { formatTimeToNow } from '../../utilities/formatDocTitle/formatDateTitle'
export type {
  RenderFieldServerFnArgs,
  RenderFieldServerFnReturnType,
} from '../../forms/fieldSchemasToFormState/serverFunctions/renderFieldServerFn'

export { useLivePreviewContext } from '../../providers/LivePreview/context'
export { LivePreviewWindow } from '../../elements/LivePreview/Window'
