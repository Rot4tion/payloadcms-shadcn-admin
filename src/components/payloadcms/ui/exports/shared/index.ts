export { Translation } from '../../elements/Translation/index'
export { withMergedProps } from '../../elements/withMergedProps/index' // cannot be within a 'use client', thus we export this from shared
export { WithServerSideProps } from '../../elements/WithServerSideProps/index'
export { mergeFieldStyles } from '../../fields/mergeFieldStyles'
export { reduceToSerializableFields } from '../../forms/Form/reduceToSerializableFields'
export { PayloadIcon } from '../../graphics/Icon/index'
export { PayloadLogo } from '../../graphics/Logo/index'
// IMPORTANT: the shared.ts file CANNOT contain any Server Components _that import client components_.
export { filterFields } from '../../providers/TableColumns/buildColumnState/filterFields'
export { getInitialColumns } from '../../providers/TableColumns/getInitialColumns'
export { abortAndIgnore, handleAbortRef } from '../../utilities/abortAndIgnore'
export { requests } from '../../utilities/api'
export { findLocaleFromCode } from '../../utilities/findLocaleFromCode'
export { formatAdminURL } from '../../utilities/formatAdminURL'
export { formatDate } from '../../utilities/formatDocTitle/formatDateTitle'
export { formatDocTitle } from '../../utilities/formatDocTitle/index'
export {
  type EntityToGroup,
  EntityType,
  groupNavItems,
  type NavGroupType,
} from '../../utilities/groupNavItems'
export { handleBackToDashboard } from '../../utilities/handleBackToDashboard'
export { handleGoBack } from '../../utilities/handleGoBack'
export { handleTakeOver } from '../../utilities/handleTakeOver'
export { hasSavePermission } from '../../utilities/hasSavePermission'
export { isClientUserObject } from '../../utilities/isClientUserObject'
export { isEditing } from '../../utilities/isEditing'
export { sanitizeID } from '../../utilities/sanitizeID'
