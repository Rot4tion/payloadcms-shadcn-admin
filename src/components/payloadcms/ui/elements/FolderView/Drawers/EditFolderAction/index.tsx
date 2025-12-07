import { useRouteCache } from '../../../../providers/RouteCache/index'
import { useTranslation } from '../../../../providers/Translation/index'
import { useDocumentDrawer } from '../../../DocumentDrawer/index'
import { ListSelectionButton } from '../../../ListSelection/index'

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
