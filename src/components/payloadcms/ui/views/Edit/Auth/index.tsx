'use client'

import type { SanitizedFieldPermissions } from 'payload'

import { getFieldPermissions } from 'payload/shared'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import type { Props } from './types'

import { Button } from '../../../elements/Button/index'
import { EmailAndUsernameFields } from '../../../elements/EmailAndUsername/index'
import { CheckboxField } from '../../../fields/Checkbox/index'
import { ConfirmPasswordField } from '../../../fields/ConfirmPassword/index'
import { PasswordField } from '../../../fields/Password/index'
import { useFormFields, useFormModified } from '@payloadcms/ui'
import { useConfig } from '@payloadcms/ui'
import { useDocumentInfo } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { cn } from '@/lib/utils'
import { APIKey } from './APIKey'

export const Auth: React.FC<Props> = (props) => {
  const {
    className,
    collectionSlug,
    disableLocalStrategy,
    email,
    loginWithUsername,
    operation,
    readOnly,
    requirePassword,
    setValidateBeforeSubmit,
    useAPIKey,
    username,
    verify,
  } = props

  const [changingPassword, setChangingPassword] = useState(requirePassword)
  const enableAPIKey = useFormFields(([fields]) => (fields && fields?.enableAPIKey) || null)
  const dispatchFields = useFormFields((reducer) => reducer[1])
  const modified = useFormModified()
  const { i18n, t } = useTranslation()
  const { docPermissions, isEditing, isInitializing, isTrashed } = useDocumentInfo()

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  let showPasswordFields: SanitizedFieldPermissions = true
  let showUnlock = true
  const hasPasswordFieldOverride =
    typeof docPermissions.fields === 'object' && 'password' in docPermissions.fields
  const hasLoginFieldOverride =
    typeof docPermissions.fields === 'object' &&
    ('username' in docPermissions.fields || 'email' in docPermissions.fields)

  if (hasPasswordFieldOverride) {
    const { permissions: passwordPermissions } = getFieldPermissions({
      field: { name: 'password', type: 'text' },
      operation,
      parentName: '',
      permissions: docPermissions?.fields,
    })

    if (operation === 'create') {
      showPasswordFields =
        passwordPermissions === true ||
        ((typeof passwordPermissions === 'object' &&
          passwordPermissions.create) as SanitizedFieldPermissions)
    } else {
      showPasswordFields =
        passwordPermissions === true ||
        ((typeof passwordPermissions === 'object' &&
          passwordPermissions.update) as SanitizedFieldPermissions)
    }
  }

  if (hasLoginFieldOverride) {
    const hasEmailAndUsernameFields =
      loginWithUsername && (loginWithUsername.requireEmail || loginWithUsername.allowEmailLogin)

    const { operation: emailPermission } = getFieldPermissions({
      field: { name: 'email', type: 'text' },
      operation: 'read',
      parentName: '',
      permissions: docPermissions?.fields,
    })

    const { operation: usernamePermission } = getFieldPermissions({
      field: { name: 'username', type: 'text' },
      operation: 'read',
      parentName: '',
      permissions: docPermissions?.fields,
    })

    if (hasEmailAndUsernameFields) {
      showUnlock = usernamePermission || emailPermission
    } else if (loginWithUsername && !hasEmailAndUsernameFields) {
      showUnlock = usernamePermission
    } else {
      showUnlock = emailPermission
    }
  }

  const enableFields =
    (!disableLocalStrategy ||
      (typeof disableLocalStrategy === 'object' && disableLocalStrategy.enableFields === true)) &&
    (showUnlock || showPasswordFields)

  const disabled = readOnly || isInitializing || isTrashed

  const apiKeyPermissions =
    docPermissions?.fields === true ? true : docPermissions?.fields?.enableAPIKey

  const apiKeyReadOnly =
    readOnly ||
    apiKeyPermissions === true ||
    (apiKeyPermissions && typeof apiKeyPermissions === 'object' && !apiKeyPermissions?.update)

  const enableAPIKeyReadOnly =
    readOnly || (apiKeyPermissions !== true && !apiKeyPermissions?.update)

  const canReadApiKey = apiKeyPermissions === true || apiKeyPermissions?.read

  const hasPermissionToUnlock: boolean = useMemo(() => {
    if (docPermissions) {
      return Boolean('unlock' in docPermissions ? docPermissions.unlock : undefined)
    }

    return false
  }, [docPermissions])

  const handleChangePassword = useCallback(
    (changingPassword: boolean) => {
      if (changingPassword) {
        setValidateBeforeSubmit(true)

        dispatchFields({
          type: 'UPDATE',
          errorMessage: t('validation:required'),
          path: 'password',
          valid: false,
        })

        dispatchFields({
          type: 'UPDATE',
          errorMessage: t('validation:required'),
          path: 'confirm-password',
          valid: false,
        })
      } else {
        setValidateBeforeSubmit(false)
        dispatchFields({ type: 'REMOVE', path: 'password' })
        dispatchFields({ type: 'REMOVE', path: 'confirm-password' })
      }

      setChangingPassword(changingPassword)
    },
    [dispatchFields, t, setValidateBeforeSubmit],
  )

  const unlock = useCallback(async () => {
    const url = `${serverURL}${api}/${collectionSlug}/unlock`
    const response = await fetch(url, {
      body:
        loginWithUsername && username ? JSON.stringify({ username }) : JSON.stringify({ email }),
      credentials: 'include',
      headers: {
        'Accept-Language': i18n.language,
        'Content-Type': 'application/json',
      },
      method: 'post',
    })

    if (response.status === 200) {
      toast.success(t('authentication:successfullyUnlocked'))
    } else {
      toast.error(t('authentication:failedToUnlock'))
    }
  }, [i18n, serverURL, api, collectionSlug, email, username, t, loginWithUsername])

  useEffect(() => {
    if (!modified) {
      setChangingPassword(false)
    }
  }, [modified])

  const showAuthBlock = enableFields
  const showAPIKeyBlock = useAPIKey && canReadApiKey
  const showVerifyBlock = verify && isEditing

  if (!(showAuthBlock || showAPIKeyBlock || showVerifyBlock)) {
    return null
  }

  return (
    <div
      className={cn(
        'p-[calc(var(--base)*2)] bg-muted flex flex-col gap-(--base) [&_.btn]:m-0',
        'max-lg:p-(--base) max-lg:gap-[calc(var(--base)/2)]',
        className,
      )}
    >
      {enableFields && (
        <React.Fragment>
          <EmailAndUsernameFields
            loginWithUsername={loginWithUsername}
            operation={operation}
            permissions={docPermissions?.fields}
            readOnly={readOnly || isTrashed}
            t={t}
          />
          {(changingPassword || requirePassword) && (!disableLocalStrategy || !enableFields) && (
            <div className="flex flex-col gap-(--base) max-lg:gap-[calc(var(--base)/2)]">
              <PasswordField
                autoComplete="new-password"
                field={{
                  name: 'password',
                  label: t('authentication:newPassword'),
                  required: true,
                }}
                indexPath=""
                parentPath=""
                parentSchemaPath=""
                path="password"
                schemaPath="password"
              />
              <ConfirmPasswordField disabled={readOnly || isTrashed} />
            </div>
          )}
          <div className="flex items-center gap-[calc(var(--base)/2)] flex-wrap">
            {changingPassword && !requirePassword && (
              <Button
                buttonStyle="secondary"
                disabled={disabled}
                id="cancel-change-password"
                onClick={() => handleChangePassword(false)}
                size="medium"
              >
                {t('general:cancel')}
              </Button>
            )}
            {!changingPassword &&
              !requirePassword &&
              !disableLocalStrategy &&
              showPasswordFields && (
                <Button
                  buttonStyle="secondary"
                  disabled={disabled}
                  id="change-password"
                  onClick={() => handleChangePassword(true)}
                  size="medium"
                >
                  {t('authentication:changePassword')}
                </Button>
              )}
            {!changingPassword && operation === 'update' && hasPermissionToUnlock && (
              <Button
                buttonStyle="secondary"
                disabled={disabled || !showUnlock}
                id="force-unlock"
                onClick={() => void unlock()}
                size="medium"
              >
                {t('authentication:forceUnlock')}
              </Button>
            )}
          </div>
        </React.Fragment>
      )}
      {useAPIKey && (
        <div className="[&_.field-type.api-key]:mb-(--base) [&_.field-type.api-key_input]:w-full [&_.field-type.api-key_input]:rounded-r-none">
          {canReadApiKey && (
            <Fragment>
              <CheckboxField
                field={{
                  name: 'enableAPIKey',
                  admin: { disabled, readOnly: enableAPIKeyReadOnly },
                  label: t('authentication:enableAPIKey'),
                }}
                path="enableAPIKey"
                schemaPath={`${collectionSlug}.enableAPIKey`}
              />
              <APIKey enabled={!!enableAPIKey?.value} readOnly={apiKeyReadOnly} />
            </Fragment>
          )}
        </div>
      )}
      {verify && isEditing && (
        <CheckboxField
          field={{
            name: '_verified',
            admin: { disabled, readOnly },
            label: t('authentication:verified'),
          }}
          path="_verified"
          schemaPath={`${collectionSlug}._verified`}
        />
      )}
    </div>
  )
}
