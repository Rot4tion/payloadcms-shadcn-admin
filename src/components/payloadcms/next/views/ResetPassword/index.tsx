// @ts-nocheck payloadcms original type safe issue will fix later
import type { AdminViewServerProps } from 'payload'

import { Button, Link } from '@/components/payloadcms/ui/exports/client'
import { Translation } from '@/components/payloadcms/ui/exports/shared'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { FormHeader } from '../../elements/FormHeader/index'
import { ResetPasswordForm } from './ResetPasswordForm/index'

export const resetPasswordBaseClass = 'reset-password'

export function ResetPassword({ initPageResult, params }: AdminViewServerProps) {
  const { req } = initPageResult

  const {
    segments: [_, token],
  } = params

  const {
    i18n,
    payload: { config },
    user,
  } = req

  const {
    admin: {
      routes: { account: accountRoute, login: loginRoute },
    },
    routes: { admin: adminRoute },
  } = config

  if (user) {
    return (
      <div className="flex flex-col gap-4">
        <FormHeader
          description={
            <Translation
              elements={{
                '0': ({ children }) => (
                  <Link
                    href={formatAdminURL({
                      adminRoute,
                      path: accountRoute,
                    })}
                    prefetch={false}
                  >
                    {children}
                  </Link>
                ),
              }}
              i18nKey="authentication:loggedInChangePassword"
              t={i18n.t}
            />
          }
          heading={i18n.t('authentication:alreadyLoggedIn')}
        />
        <Button buttonStyle="secondary" el="link" size="large" to={adminRoute}>
          {i18n.t('general:backToDashboard')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <FormHeader heading={i18n.t('authentication:resetPassword')} />
      <ResetPasswordForm token={token} />
      <Link
        href={formatAdminURL({
          adminRoute,
          path: loginRoute,
        })}
        prefetch={false}
      >
        {i18n.t('authentication:backToLogin')}
      </Link>
    </div>
  )
}
