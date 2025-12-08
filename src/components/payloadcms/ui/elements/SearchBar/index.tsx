import { cn } from '@/lib/utils'
import { SearchIcon } from '../../icons/Search'
import { SearchFilter } from '../SearchFilter'

type SearchBarProps = {
  Actions?: React.ReactNode[]
  className?: string
  label?: string
  onSearchChange: (search: string) => void
  searchQueryParam?: string
}
export function SearchBar({
  Actions,
  className,
  label = 'Search...',
  onSearchChange,
  searchQueryParam,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        'search-bar',
        'grid w-full bg-muted rounded-md relative min-h-[46px] isolate',
        Actions && Actions.length > 0 ? 'grid-cols-[auto_1fr_auto]' : 'grid-cols-[auto_1fr]',
        '[&:has(.popup--active)]:z-[1]',
        className,
      )}
    >
      <div className="col-start-1 col-end-2 row-start-1 row-end-2 z-1 self-center justify-self-center pointer-events-none w-10 flex items-center justify-center">
        <SearchIcon />
      </div>
      <div className="col-start-1 col-end-3 row-start-1 row-end-2 bg-transparent rounded-[inherit] h-full [&_input]:py-2 [&_input]:ps-10 [&_input]:pe-4 [&_input]:bg-transparent">
        <SearchFilter
          handleChange={onSearchChange}
          label={label}
          searchQueryParam={searchQueryParam}
        />
      </div>
      {Actions && Actions.length > 0 ? (
        <div className="search-bar__actions flex items-center gap-1 p-2 col-start-3 col-end-4">
          {Actions}
        </div>
      ) : null}
    </div>
  )
}
