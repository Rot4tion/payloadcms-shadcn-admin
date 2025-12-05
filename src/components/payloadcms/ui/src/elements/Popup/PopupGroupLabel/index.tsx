import React from 'react'

export const PopupListGroupLabel: React.FC<{
  label: string
}> = ({ label }) => {
  return <p className="mb-2 mt-1 text-sm font-medium leading-none text-muted-foreground">{label}</p>
}
