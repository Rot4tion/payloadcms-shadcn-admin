import React from 'react'

export const SortDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className="size-(--base)" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      className="stroke-current fill-(--theme-elevation-800) [stroke-width:var(--style-stroke-width-s)]"
      d="M2.5 13.3333L5.83333 16.6667M5.83333 16.6667L9.16667 13.3333M5.83333 16.6667V3.33333M9.16667 7.08333H17.5M9.16667 10.4167H15M11.6667 13.75H12.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const SortUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className="size-(--base)" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      className="stroke-current fill-(--theme-elevation-800) [stroke-width:var(--style-stroke-width-s)]"
      d="M2.5 6.66668L5.83333 3.33334M5.83333 3.33334L9.16667 6.66668M5.83333 3.33334V16.6667M11.6667 7.08354H17.5M9.16667 10.4169H15M9.16667 13.7502H12.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
