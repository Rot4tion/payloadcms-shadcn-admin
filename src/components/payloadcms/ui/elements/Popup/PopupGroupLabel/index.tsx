import React from 'react'

export const PopupListGroupLabel: React.FC<{
  label: string
}> = ({ label }) => {
  return (
    <span className="popup-list-group-label block text-muted-foreground font-medium leading-none mt-1 mb-2 px-2">
      {label}
    </span>
  )
}
