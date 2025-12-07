'use client'
import { useEffect } from 'react'

import type { StepNavItem } from './types'

import { useStepNav } from './context'

export const SetStepNav: React.FC<{
  nav: StepNavItem[]
}> = ({ nav }) => {
  const { setStepNav } = useStepNav()

  useEffect(() => {
    setStepNav(nav)
  }, [setStepNav, nav])

  return null
}
