'use client'

import { useModal } from '../Modal/index'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { useEffectEvent } from '../../hooks/useEffectEvent'

export function CloseModalOnRouteChange() {
  const { closeAllModals } = useModal()
  const pathname = usePathname()

  const closeAllModalsEffectEvent = useEffectEvent(() => {
    closeAllModals()
  })

  const initialRenderRef = useRef(true)

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }

    closeAllModalsEffectEvent()
  }, [pathname])

  return null
}
