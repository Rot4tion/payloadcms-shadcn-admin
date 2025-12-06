import { GridViewIcon } from '../../../icons/GridView/index.js'
import { ListViewIcon } from '../../../icons/ListView/index.js'
import { Button } from '../../Button/index.js'
import { cn } from '@/lib/utils'

type Props = {
  activeView: 'grid' | 'list'
  setActiveView: (view: 'grid' | 'list') => void
}
export function ToggleViewButtons({ activeView, setActiveView }: Props) {
  return (
    <>
      <Button
        buttonStyle="pill"
        className={cn(
          'p-0 bg-transparent [&_.btn__icon]:border-0 [&_.btn__icon]:p-0',
          activeView === 'grid' && 'bg-muted',
        )}
        icon={<GridViewIcon />}
        margin={false}
        onClick={() => {
          setActiveView('grid')
        }}
      />
      <Button
        buttonStyle="pill"
        className={cn(
          'p-0 bg-transparent [&_.btn__icon]:border-0 [&_.btn__icon]:p-0',
          activeView === 'list' && 'bg-muted',
        )}
        icon={<ListViewIcon />}
        margin={false}
        onClick={() => {
          setActiveView('list')
        }}
      />
    </>
  )
}
