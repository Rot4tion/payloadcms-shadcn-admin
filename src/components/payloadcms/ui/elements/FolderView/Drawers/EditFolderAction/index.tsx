// @ts-nocheck payloadcms original type safe issue will fix later
import { useRouteCache } from '../../../../providers/RouteCache'
import { useTranslation } from '../../../../providers/Translation'
import { useDocumentDrawer } from '../../../DocumentDrawer'
import { ListSelectionButton } from '../../../ListSelection'

type EditFolderActionProps = {
  folderCollectionSlug: string
  id: number | string
}
export const EditFolderAction = ({ id, folderCollectionSlug }: EditFolderActionProps) => {
  const { clearRouteCache } = useRouteCache()
  const { t } = useTranslation()
  const [FolderDocumentDrawer, , { closeDrawer, openDrawer }] = useDocumentDrawer({
    id,
    collectionSlug: folderCollectionSlug,
  })

  if (!id) {
    return null
  }

  return (
    <>
      <ListSelectionButton onClick={openDrawer} type="button">
        {t('general:edit')}
      </ListSelectionButton>

      <FolderDocumentDrawer
        onSave={() => {
          closeDrawer()
          clearRouteCache()
        }}
      />
    </>
  )
}
