import type { RelationshipFieldServerProps } from 'payload'

// eslint-disable-next-line payload/no-imports-from-exports-dir
import { MoveDocToFolder } from '../../../exports/client/index'

export const FolderField = (props: RelationshipFieldServerProps) => {
  if (props.payload.config.folders === false) {
    return null
  }
  return (
    <MoveDocToFolder
      folderCollectionSlug={props.payload.config.folders.slug}
      folderFieldName={props.payload.config.folders.fieldName}
    />
  )
}
