import React from 'react'

const baseClass = 'popup-list-group-label'

export const PopupListGroupLabel: React.FC<{
  label: string
}> = ({ label }) => {
  return <p className={baseClass}>{label}</p>
}
