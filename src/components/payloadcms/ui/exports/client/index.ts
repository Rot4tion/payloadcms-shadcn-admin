/* eslint-disable perfectionist/sort-exports */
'use client'

// IMPORTANT: this file cannot use any wildcard exports because it is wrapped in a `use client` boundary
// IMPORTANT: do _not_ alias any of the exports in this file, this will cause a mismatch between the unbundled exports

// hooks

export { fieldComponents } from '../../fields/index'

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

export { SortHeader } from '../../elements/SortHeader/index'
export { SortRow } from '../../elements/SortRow/index'
export { OrderableTable } from '../../elements/Table/OrderableTable'

// query preset elements
export { QueryPresetsColumnsCell } from '../../elements/QueryPresets/cells/ColumnsCell/index'
export { QueryPresetsWhereCell } from '../../elements/QueryPresets/cells/WhereCell/index'
export { QueryPresetsAccessCell } from '../../elements/QueryPresets/cells/AccessCell/index'
export { QueryPresetsColumnField } from '../../elements/QueryPresets/fields/ColumnsField/index'
export { QueryPresetsWhereField } from '../../elements/QueryPresets/fields/WhereField/index'

// elements
export { ConfirmationModal } from '../../elements/ConfirmationModal/index'
export type { OnCancel } from '../../elements/ConfirmationModal/index'
export { Link } from '../../elements/Link/index'
export { LeaveWithoutSaving } from '../../elements/LeaveWithoutSaving/index'
export { DocumentTakeOver } from '../../elements/DocumentTakeOver/index'
export { DocumentLocked } from '../../elements/DocumentLocked/index'
export { TableColumnsProvider, useTableColumns } from '@payloadcms/ui'
export {
  RenderDefaultCell,
  useCellProps,
} from '../../providers/TableColumns/RenderDefaultCell/index'
export { DateCell } from '../../elements/Table/DefaultCell/fields/Date/index'

export { Translation } from '../../elements/Translation/index'
export { default as DatePicker } from '../../elements/DatePicker/DatePicker'
export { ViewDescription } from '../../elements/ViewDescription/index'
export { AppHeader } from '../../elements/AppHeader/index'
export { RenderCustomComponent } from '../../elements/RenderCustomComponent/index'
// BulkUpload - re-export from @payloadcms/ui for shared drawer context
export {
  BulkUploadDrawer,
  BulkUploadProvider,
  useBulkUpload,
  useBulkUploadDrawerSlug,
} from '@payloadcms/ui'
export { DrawerContentContainer } from '../../elements/DrawerContentContainer/index'
export type { BulkUploadProps } from '@payloadcms/ui'
export { Banner } from '../../elements/Banner/index'
export { Button } from '../../elements/Button/index'
export { AnimateHeight } from '../../elements/AnimateHeight/index'
export { PillSelector, type SelectablePill } from '../../elements/PillSelector/index'
export { Card } from '../../elements/Card/index'
export { Collapsible, useCollapsible } from '../../elements/Collapsible/index'
export { CopyLocaleData } from '../../elements/CopyLocaleData/index'
export { CopyToClipboard } from '../../elements/CopyToClipboard/index'
export { DeleteMany } from '../../elements/DeleteMany/index'
export { DocumentControls } from '../../elements/DocumentControls/index'
export { Dropzone } from '../../elements/Dropzone/index'
// Re-export from @payloadcms/ui for shared drawer context
export { documentDrawerBaseClass, useDocumentDrawer } from '@payloadcms/ui'
export { getHTMLDiffComponents } from '../../elements/HTMLDiff/index'
export type {
  DocumentDrawerProps,
  DocumentTogglerProps,
  UseDocumentDrawer,
} from '../../elements/DocumentDrawer/types'
export { useClickOutside } from '../../hooks/useClickOutside'
export { useClickOutsideContext } from '../../providers/ClickOutside/index'
export { useDocumentDrawerContext } from '../../elements/DocumentDrawer/Provider'
export { DocumentFields } from '../../elements/DocumentFields/index'
// Re-export from @payloadcms/ui for shared drawer context
export { Drawer, DrawerToggler, formatDrawerSlug, useDrawerSlug } from '@payloadcms/ui'
export { EditMany } from '../../elements/EditMany/index'
export { ErrorPill } from '../../elements/ErrorPill/index'
export { FullscreenModal } from '../../elements/FullscreenModal/index'
export { GenerateConfirmation } from '../../elements/GenerateConfirmation/index'
export { Gutter } from '../../elements/Gutter/index'
export { Hamburger } from '../../elements/Hamburger/index'
export { HydrateAuthProvider } from '../../elements/HydrateAuthProvider/index'
export { Locked } from '../../elements/Locked/index'
export { ListControls } from '../../elements/ListControls/index'
export { useListDrawer } from '@payloadcms/ui'
export type {
  ListDrawerProps,
  ListTogglerProps,
  RenderListServerFnArgs,
  RenderListServerFnReturnType,
  UseListDrawer,
} from '../../elements/ListDrawer/types'
export { ListSelection } from '../../views/List/ListSelection/index'
export { CollectionListHeader as ListHeader } from '../../views/List/ListHeader/index'
export { GroupByHeader } from '../../views/List/GroupByHeader/index'
export { PageControls, PageControlsComponent } from '../../elements/PageControls/index'
export { StickyToolbar } from '../../elements/StickyToolbar/index'

export { GroupByPageControls } from '../../elements/PageControls/GroupByPageControls'
export { LoadingOverlayToggle } from '../../elements/Loading/index'
export { FormLoadingOverlayToggle } from '../../elements/Loading/index'
export { LoadingOverlay } from '../../elements/Loading/index'
export { Logout } from '../../elements/Logout/index'
export { Modal, useModal } from '@payloadcms/ui'
export { NavToggler } from '../../elements/Nav/NavToggler/index'
export { NavContext, NavProvider, useNav } from '@payloadcms/ui'
export { NavGroup } from '../../elements/NavGroup/index'
export { Pagination } from '../../elements/Pagination/index'
export { PerPage } from '../../elements/PerPage/index'
export { Pill } from '../../elements/Pill/index'
import * as PopupList from '../../elements/Popup/PopupButtonList/index'
export { PopupList }
export { Popup } from '../../elements/Popup/index'
export { Combobox } from '../../elements/Combobox/index'
export type { ComboboxEntry, ComboboxProps } from '../../elements/Combobox/index'
export { PublishMany } from '../../elements/PublishMany/index'
export { PublishButton } from '../../elements/PublishButton/index'
export { SaveButton } from '../../elements/SaveButton/index'
export { SaveDraftButton } from '../../elements/SaveDraftButton/index'

// folder elements
export { FolderProvider, useFolder } from '@payloadcms/ui'
export { BrowseByFolderButton } from '../../elements/FolderView/BrowseByFolderButton/index'
export { FolderTypeField } from '../../elements/FolderView/FolderTypeField/index'
export { FolderFileTable } from '../../elements/FolderView/FolderFileTable/index'
export { ItemCardGrid } from '../../elements/FolderView/ItemCardGrid/index'

export { type Option as ReactSelectOption, ReactSelect } from '../../elements/ReactSelect/index'
export { ReactSelect as Select } from '../../elements/ReactSelect/index'
export { RenderTitle } from '../../elements/RenderTitle/index'
export { ShimmerEffect } from '../../elements/ShimmerEffect/index'
export { StaggeredShimmers } from '../../elements/ShimmerEffect/index'
export { SortColumn } from '../../elements/SortColumn/index'
export { SetStepNav } from '../../elements/StepNav/SetStepNav'
export { useStepNav } from '../../elements/StepNav/index'
export type { StepNavItem } from '../../elements/StepNav/types'
export {
  RelationshipProvider,
  useListRelationships,
} from '../../elements/Table/RelationshipProvider/index'
export { Table } from '../../elements/Table/index'
export { DefaultCell } from '../../elements/Table/DefaultCell/index'
export { Thumbnail } from '../../elements/Thumbnail/index'
export { Tooltip } from '../../elements/Tooltip/index'
import { toast } from 'sonner'
export { toast }
export { UnpublishMany } from '../../elements/UnpublishMany/index'
export { Upload } from '../../elements/Upload/index'
export { SearchFilter } from '../../elements/SearchFilter/index'
export { EditUpload } from '../../elements/EditUpload/index'
export { FileDetails } from '../../elements/FileDetails/index'
export { PreviewSizes } from '../../elements/PreviewSizes/index'
export { PreviewButton } from '../../elements/PreviewButton/index'
export { RelationshipTable } from '../../elements/RelationshipTable/index'
export { TimezonePicker } from '../../elements/TimezonePicker/index'
export {
  MoveDocToFolder,
  MoveDocToFolderButton,
} from '../../elements/FolderView/MoveDocToFolder/index'

export { BlocksDrawer } from '../../fields/Blocks/BlocksDrawer/index'
export { BlockSelector } from '../../fields/Blocks/BlockSelector/index'
export { SectionTitle } from '../../fields/Blocks/SectionTitle/index'

// fields
export { HiddenField } from '../../fields/Hidden/index'
export { ArrayField } from '../../fields/Array/index'
export { BlocksField } from '../../fields/Blocks/index'
export { CheckboxField, CheckboxInput } from '../../fields/Checkbox/index'
export { CodeField } from '../../fields/Code/index'
export { CodeEditor as CodeEditorLazy } from '../../elements/CodeEditor/index'
export { default as CodeEdiftor } from '../../elements/CodeEditor/CodeEditor'

export { CollapsibleField } from '../../fields/Collapsible/index'
export { ConfirmPasswordField } from '../../fields/ConfirmPassword/index'
export { DateTimeField } from '../../fields/DateTime/index'
export { EmailField } from '../../fields/Email/index'
export { FieldDescription } from '../../fields/FieldDescription/index'
export { FieldError } from '../../fields/FieldError/index'
export { FieldLabel } from '../../fields/FieldLabel/index'
export { GroupField } from '../../fields/Group/index'
export { JSONField } from '../../fields/JSON/index'
export { NumberField } from '../../fields/Number/index'
export { PasswordField } from '../../fields/Password/index'
export { PointField } from '../../fields/Point/index'
export { RadioGroupField } from '../../fields/RadioGroup/index'
export { RelationshipField, RelationshipInput } from '../../fields/Relationship/index'
export { RichTextField } from '../../fields/RichText/index'
export { RowField } from '../../fields/Row/index'
export { SelectField, SelectInput } from '../../fields/Select/index'
export { TabsField, TabsProvider } from '../../fields/Tabs/index'
export { TabComponent } from '../../fields/Tabs/Tab/index'
export { SlugField } from '../../fields/Slug/index'

export { TextField, TextInput } from '../../fields/Text/index'
export { JoinField } from '../../fields/Join/index'
export type { TextInputProps } from '../../fields/Text/index'
export { allFieldComponents } from '../../fields/index'

export { TextareaField, TextareaInput } from '../../fields/Textarea/index'
export type { TextAreaInputProps } from '../../fields/Textarea/index'

export { UIField } from '../../fields/UI/index'
export { UploadField, UploadInput } from '../../fields/Upload/index'
export type { UploadInputProps } from '../../fields/Upload/index'

export { fieldBaseClass } from '../../fields/shared/index'

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
export { Form, type FormProps } from '../../forms/Form/index'
export type { FieldAction } from '../../forms/Form/types'
export { fieldReducer } from '../../forms/Form/fieldReducer'
export { NullifyLocaleField } from '../../forms/NullifyField/index'
export { RenderFields } from '../../forms/RenderFields/index'

export { RowLabel, type RowLabelProps } from '../../forms/RowLabel/index'
export { RowLabelProvider, useRowLabel } from '@payloadcms/ui'

export { FormSubmit } from '../../forms/Submit/index'
export { WatchChildErrors } from '../../forms/WatchChildErrors/index'
export { FieldContext, useField } from '../../forms/useField/index'
export type { FieldType, Options } from '../../forms/useField/types'

export { withCondition } from '../../forms/withCondition/index'
export { WatchCondition } from '../../forms/withCondition/WatchCondition'

// graphics
export { Account } from '../../graphics/Account/index'
export { PayloadIcon } from '../../graphics/Icon/index'

export { DefaultBlockImage } from '../../graphics/DefaultBlockImage/index'
export { File } from '../../graphics/File/index'

// icons
export { CalendarIcon } from '../../icons/Calendar/index'
export { CheckIcon } from '../../icons/Check/index'
export { ChevronIcon } from '../../icons/Chevron/index'
export { CloseMenuIcon } from '../../icons/CloseMenu/index'
export { CodeBlockIcon } from '../../icons/CodeBlock/index'
export { CopyIcon } from '../../icons/Copy/index'
export { DragHandleIcon } from '../../icons/DragHandle/index'
export { EditIcon } from '../../icons/Edit/index'
export { ExternalLinkIcon } from '../../icons/ExternalLink/index'
export { LineIcon } from '../../icons/Line/index'
export { LinkIcon } from '../../icons/Link/index'
export { LogOutIcon } from '../../icons/LogOut/index'
export { MenuIcon } from '../../icons/Menu/index'
export { MinimizeMaximizeIcon } from '../../icons/MinimizeMaximize/index'
export { MoreIcon } from '../../icons/More/index'
export { PlusIcon } from '../../icons/Plus/index'
export { SearchIcon } from '../../icons/Search/index'
export { SwapIcon } from '../../icons/Swap/index'
export { XIcon } from '../../icons/X/index'
export { FolderIcon } from '../../icons/Folder/index'
export { GearIcon } from '../../icons/Gear/index'
export { DocumentIcon } from '../../icons/Document/index'
export { MoveFolderIcon } from '../../icons/MoveFolder/index'
export { GridViewIcon } from '../../icons/GridView/index'
export { ListViewIcon } from '../../icons/ListView/index'

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
export { ProgressBar } from '../../providers/RouteTransition/ProgressBar/index'
export { useControllableState } from '../../hooks/useControllableState'

export { Text as TextCondition } from '../../elements/WhereBuilder/Condition/Text/index'
export { Select as SelectCondition } from '../../elements/WhereBuilder/Condition/Select/index'
export { RelationshipFilter as RelationshipCondition } from '../../elements/WhereBuilder/Condition/Relationship/index'
export { NumberFilter as NumberCondition } from '../../elements/WhereBuilder/Condition/Number/index'
export { DateFilter as DateCondition } from '../../elements/WhereBuilder/Condition/Date/index'
export { EmailAndUsernameFields } from '../../elements/EmailAndUsername/index'
export { SelectAll } from '../../elements/SelectAll/index'
export { SelectRow } from '../../elements/SelectRow/index'
export { SelectMany } from '../../elements/SelectMany/index'

export { DefaultListView } from '../../views/List/index'
export { DefaultCollectionFolderView } from '../../views/CollectionFolder/index'
export { DefaultBrowseByFolderView } from '../../views/BrowseByFolder/index'

export type { ListHeaderProps } from '../../views/List/ListHeader/index'

export { DefaultEditView } from '../../views/Edit/index'
export { SetDocumentStepNav } from '../../views/Edit/SetDocumentStepNav/index'
export { SetDocumentTitle } from '../../views/Edit/SetDocumentTitle/index'

export { parseSearchParams } from '../../utilities/parseSearchParams'
export { FieldDiffLabel } from '../../elements/FieldDiffLabel/index'
export { FieldDiffContainer } from '../../elements/FieldDiffContainer/index'
export { formatTimeToNow } from '../../utilities/formatDocTitle/formatDateTitle'
export type {
  RenderFieldServerFnArgs,
  RenderFieldServerFnReturnType,
} from '../../forms/fieldSchemasToFormState/serverFunctions/renderFieldServerFn'

export { useLivePreviewContext } from '../../providers/LivePreview/context'
export { LivePreviewWindow } from '../../elements/LivePreview/Window/index'
