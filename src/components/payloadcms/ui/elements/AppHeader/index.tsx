'use client'
import { formatAdminURL } from 'payload/shared'
import React, { useEffect, useRef, useState } from 'react'

import { Account } from '../../graphics/Account'
import { useActions } from '../../providers/Actions'
import { useConfig } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Hamburger } from '../Hamburger'
import { Link } from '../Link'
import { Localizer } from '../Localizer'
import { LocalizerLabel } from '../Localizer/LocalizerLabel'
import { useNav } from '../Nav/context'
import { NavToggler } from '../Nav/NavToggler'
import { RenderCustomComponent } from '../RenderCustomComponent'
import { StepNav } from '../StepNav'
import { cn } from '@/lib/utils'

/**
 * AppHeader - Top navigation bar (Tailwind version)
 *
 * Original SCSS:
 * - position: relative, width: 100%, height: var(--app-header-height), z-index: var(--z-modal)
 * - content padding: 0 var(--gutter-h)
 * - wrapper gap: calc(var(--base) / 2)
 */
type Props = {
  CustomAvatar?: React.ReactNode
  CustomIcon?: React.ReactNode
}

export function AppHeader({ CustomAvatar, CustomIcon }: Props) {
  const { t } = useTranslation()

  const { Actions } = useActions()

  const {
    config: {
      admin: {
        routes: { account: accountRoute },
      },
      localization,
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const { navOpen } = useNav()

  const customControlsRef = useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = useState(false)

  useEffect(() => {
    const checkIsScrollable = () => {
      const el = customControlsRef.current
      if (el) {
        const scrollable = el.scrollWidth > el.clientWidth
        setIsScrollable(scrollable)
      }
    }

    checkIsScrollable()
    window.addEventListener('resize', checkIsScrollable)

    return () => {
      window.removeEventListener('resize', checkIsScrollable)
    }
  }, [Actions])

  const ActionComponents = Actions ? Object.values(Actions) : []

  return (
    <header
      className={cn(
        // app-header base: relative, w-full, h:app-header-height, z:z-modal(30)
        'relative w-full z-30',
      )}
      style={{ height: 'var(--app-header-height)' }}
    >
      {/* app-header__bg - opacity:0, absolute, inset:0, pointer-events:none */}
      <div className="opacity-0 absolute left-0 top-0 w-full h-full pointer-events-none" />

      {/* app-header__content - flex, items-center, h-full, px:gutter-h, relative, grow */}
      <div
        className="flex items-center h-full relative grow"
        style={{ padding: '0 var(--gutter-h)' }}
      >
        {/* app-header__wrapper - flex, gap:base/2, items-center, h-full, grow, justify-between, w-full */}
        <div
          className="flex items-center h-full grow justify-between w-full"
          style={{ gap: 'calc(var(--base) / 2)' }}
        >
          {/* app-header__mobile-nav-toggler - hidden by default, flex ONLY on small screens (< 768px) */}
          <NavToggler
            className={cn(
              // Original: display:none by default, display:flex on @include small-break (< 768px)
              'hidden max-md:flex items-center',
              navOpen && 'opacity-50',
            )}
            tabIndex={-1}
          >
            <Hamburger />
          </NavToggler>

          {/* app-header__controls-wrapper - flex, items-center, flex:1, min-w:0 */}
          <div className="flex items-center flex-1 min-w-0">
            {/* app-header__step-nav-wrapper - grow:0, overflow:auto, flex, w-full, scrollbar-hide */}
            <div className="grow-0 overflow-auto flex w-full scrollbar-none [&::-webkit-scrollbar]:hidden">
              <StepNav CustomIcon={CustomIcon} />
            </div>

            {/* app-header__actions-wrapper - relative, flex, items-center, gap:base/2, mr:base */}
            <div
              className="relative flex items-center"
              style={{
                gap: 'calc(var(--base) / 2)',
                marginRight: 'var(--base)',
              }}
            >
              {/* app-header__actions - flex, items-center, gap:base/2, shrink-0, max-w:600px, whitespace-nowrap */}
              <div
                className={cn(
                  'flex items-center shrink-0 whitespace-nowrap',
                  'scrollbar-none [&::-webkit-scrollbar]:hidden',
                  // Responsive max-width: 600px -> 500px (lg) -> 300px (md) -> 150px (sm)
                  'max-w-[600px] lg:max-w-[500px] md:max-w-[300px] sm:max-w-[150px]',
                )}
                style={{ gap: 'calc(var(--base) / 2)' }}
                ref={customControlsRef}
              >
                {ActionComponents.map((Action, i) => (
                  <div
                    className={cn(
                      isScrollable && i === ActionComponents.length - 1 && 'mr-[var(--base)]',
                    )}
                    key={i}
                  >
                    {Action}
                  </div>
                ))}
              </div>

              {/* app-header__gradient-placeholder - absolute, top:0, right:0, w:base, h:base, gradient */}
              {isScrollable && (
                <div
                  className="absolute top-0 right-0"
                  style={{
                    width: 'var(--base)',
                    height: 'var(--base)',
                    background: 'linear-gradient(to right, transparent, var(--theme-bg))',
                  }}
                />
              )}
            </div>

            {/* app-header__localizer-spacing - visibility:hidden (placeholder) */}
            {localization && <LocalizerLabel ariaLabel="invisible" className="invisible" />}

            {/* app-header__account - relative, shrink-0, focus styles */}
            <Link
              aria-label={t('authentication:account')}
              className={cn(
                'relative shrink-0',
                'focus:not-focus-visible:opacity-100',
                'focus-visible:outline-none focus-visible:after:content-[""] focus-visible:after:border-2 focus-visible:after:border-foreground focus-visible:after:absolute focus-visible:after:inset-0 focus-visible:after:pointer-events-none',
              )}
              href={formatAdminURL({ adminRoute, path: accountRoute })}
              prefetch={false}
              tabIndex={0}
            >
              <RenderCustomComponent CustomComponent={CustomAvatar} Fallback={<Account />} />
            </Link>
          </div>
        </div>
      </div>

      {/* app-header__localizer - absolute, top:50%, right:base(4.5)=90px, transform:translateY(-50%) */}
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2',
          // default: right: base(4.5)
          'right-[calc(var(--base)*4.5)]',
          // small-break: right: base(2)
          'max-md:right-[calc(var(--base)*2)]',
          // RTL: right: unset; left: base(4.5) (and base(2) on small)
          'rtl:right-auto rtl:left-[calc(var(--base)*4.5)] rtl:max-md:left-[calc(var(--base)*2)]',
          // when nav is open, hide only on small screens (matches &--nav-open small-break rule)
          navOpen && 'max-md:hidden',
        )}
      >
        <Localizer />
      </div>
    </header>
  )
}
