import type { AdminViewServerProps } from 'payload'

import React from 'react'

import { LogoutClient } from './LogoutClient'

export const LogoutView: React.FC<
  {
    inactivity?: boolean
  } & AdminViewServerProps
> = ({ inactivity, initPageResult, searchParams }) => {
  const {
    req: {
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
    },
  } = initPageResult

  return (
    <div className="flex flex-col items-center flex-wrap">
      <LogoutClient
        adminRoute={adminRoute}
        inactivity={inactivity}
        redirect={searchParams.redirect as string}
      />
    </div>
  )
}

export function LogoutInactivity(props: AdminViewServerProps) {
  return <LogoutView inactivity {...props} />
}
