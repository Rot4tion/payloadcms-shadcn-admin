'use client'
import { Button, Gutter, useConfig, useStepNav, useTranslation } from '@payloadcms-local/ui'
import { cn } from '@/lib/utils'
import React, { useEffect } from 'react'

export const NotFoundClient: React.FC<{
  marginTop?: 'large'
}> = (props) => {
  const { marginTop = 'large' } = props

  const { setStepNav } = useStepNav()
  const { t } = useTranslation()

  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  useEffect(() => {
    setStepNav([
      {
        label: t('general:notFound'),
      },
    ])
  }, [setStepNav, t])

  return (
    <div
      className={cn(
        'flex mt-[var(--base)] max-md:mt-[calc(var(--base)/2)]',
        marginTop === 'large' &&
          'mt-[calc(var(--base)*2)] max-xl:mt-[var(--base)] max-md:mt-[calc(var(--base)/2)]',
      )}
    >
      <Gutter className="flex flex-col items-start gap-4 max-w-[720px]">
        <div className="flex flex-col gap-2 [&>*]:m-0">
          <h1>{t('general:nothingFound')}</h1>
          <p>{t('general:sorryNotFound')}</p>
        </div>
        <Button className="m-0" el="link" size="large" to={adminRoute}>
          {t('general:backToDashboard')}
        </Button>
      </Gutter>
    </div>
  )
}
