import React from 'react'

export const FieldDiffLabel: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="mb-[calc(var(--base)*0.35)] font-semibold flex flex-row h-full items-center leading-normal">
    {children}
  </div>
)
