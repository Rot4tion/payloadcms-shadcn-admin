// @ts-nocheck payloadcms original type safe issue will fix later
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'

import { cn } from '@/lib/utils'

export type DefaultBlockImageProps = {
  className?: string
}

export const DefaultBlockImage: React.FC<DefaultBlockImageProps> = ({ className }) => {
  const [patternID] = useState(() => `pattern${uuid()}`)

  return (
    <svg
      className={cn('w-[231px] h-[151px]', className)}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 231 151"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${patternID})`}>
        <rect className="fill-muted" height="100%" rx="2" width="100%" />
        <rect
          className="fill-muted-foreground/40"
          height="116.063"
          transform="rotate(52.0687 33.7051 79.3051)"
          width="85.8593"
          x="33.7051"
          y="79.3051"
        />
        <rect
          className="fill-muted-foreground/40"
          height="116.063"
          transform="rotate(52.0687 86.1219 92.6272)"
          width="85.8593"
          x="86.1219"
          y="92.6272"
        />
        <circle className="fill-muted-foreground/40" cx="189" cy="45" r="19" />
        <rect className="fill-muted-foreground/50" height="5" rx="2.5" width="98" x="66" y="70" />
        <rect className="fill-muted-foreground/50" height="5" rx="2.5" width="76" x="77" y="82" />
      </g>
      <defs>
        <clipPath id={`${patternID}`}>
          <rect className="fill-background" height="151" width="231" />
        </clipPath>
      </defs>
    </svg>
  )
}
