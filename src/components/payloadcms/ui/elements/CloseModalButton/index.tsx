import { useModal } from '../Modal'

import { XIcon } from '../../icons/X'
import { useTranslation } from '@payloadcms/ui'
import { cn } from '@/lib/utils'

export function CloseModalButton({ slug, className }: { className?: string; slug: string }) {
  const { closeModal } = useModal()
  const { t } = useTranslation()

  return (
    <button
      aria-label={t('general:close')}
      className={cn(
        'shrink-0 border-0 bg-transparent p-0 m-0 cursor-pointer overflow-hidden self-start',
        'size-(--base)',
        '[&_svg]:size-[calc(var(--base)*2)] [&_svg]:relative [&_svg]:start-[calc(var(--base)*-0.5)] [&_svg]:top-[calc(var(--base)*-0.5)]',
        '[&_.stroke]:stroke-2 [&_.stroke]:[vector-effect:non-scaling-stroke]',
        className,
      )}
      key="close-button"
      onClick={() => {
        closeModal(slug)
      }}
      type="button"
    >
      <XIcon />
    </button>
  )
}
