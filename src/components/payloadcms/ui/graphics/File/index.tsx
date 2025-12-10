import React from 'react'

import { cn } from '@/lib/utils'

export type FileProps = {
  className?: string
}

export const File: React.FC<FileProps> = ({ className }) => (
  <svg
    className={cn('size-[150px] bg-muted-foreground', className)}
    viewBox="0 0 150 150"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill-background"
      d="M82.8876 50.5H55.5555V100.5H94.4444V61.9818H82.8876V50.5Z"
    />
    <path className="fill-muted-foreground/60" d="M82.8876 61.9818H94.4444L82.8876 50.5V61.9818Z" />
  </svg>
)
