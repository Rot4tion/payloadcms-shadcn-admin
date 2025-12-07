import React from 'react'

/**
 * @internal
 */
export const StickyToolbar: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <div className="p-[calc(var(--base)*0.5)] sticky bottom-(--base) bg-background border border-border/50 max-w-[500px] z-[1] ml-[50%] -translate-x-1/2 rounded-md shadow-lg mt-[calc(var(--base)*2)] max-md:w-[calc(100%-var(--base)*2)] max-md:ml-(--base) max-md:translate-x-0 max-md:relative max-md:max-w-none max-md:mb-[calc(var(--base)*4)]">
    {children}
  </div>
)
