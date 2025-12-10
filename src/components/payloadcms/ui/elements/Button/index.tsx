// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import React, { Fragment, isValidElement } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import type { Props } from './types'

import { cn } from '@/lib/utils'
import { ChevronIcon } from '../../icons/Chevron'
import { EditIcon } from '../../icons/Edit'
import { LinkIcon } from '../../icons/Link'
import { PlusIcon } from '../../icons/Plus'
import { SwapIcon } from '../../icons/Swap'
import { XIcon } from '../../icons/X'
import { Link } from '../Link'
import { Popup } from '../Popup'
import { Tooltip } from '../Tooltip'

const icons = {
  chevron: ChevronIcon,
  edit: EditIcon,
  link: LinkIcon,
  plus: PlusIcon,
  swap: SwapIcon,
  x: XIcon,
}

// Button variants using CVA - Shadcn/Tailwind style
export const payloadButtonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center',
    'rounded-[var(--style-radius-s)] font-normal',
    'border-0 cursor-pointer no-underline',
    'text-(length:--base-body-size) leading-[calc(var(--base)*1.2)]',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ],
  {
    variants: {
      buttonStyle: {
        primary: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90',
          'disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed',
        ],
        secondary: [
          'bg-transparent text-foreground',
          'border border-input',
          'hover:bg-accent hover:text-accent-foreground',
          'disabled:text-muted-foreground disabled:border-muted disabled:cursor-not-allowed',
        ],
        pill: [
          'bg-secondary text-secondary-foreground',
          'hover:bg-secondary/80',
          'disabled:text-muted-foreground disabled:cursor-not-allowed',
        ],
        'icon-label': [
          'p-0 font-semibold',
          'bg-transparent text-foreground',
          'hover:text-muted-foreground',
          'disabled:text-muted-foreground disabled:cursor-not-allowed',
        ],
        subtle: [
          'bg-muted text-foreground',
          'border border-border',
          'hover:bg-muted/80 hover:border-border/80',
          'disabled:text-muted-foreground disabled:cursor-not-allowed',
        ],
        tab: [
          'bg-transparent text-foreground font-medium',
          'hover:bg-muted/50',
          'disabled:font-semibold disabled:bg-muted disabled:cursor-not-allowed',
        ],
        error: [
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ],
        transparent: [
          'bg-transparent text-foreground',
          'hover:bg-accent hover:text-accent-foreground',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ],
        none: 'p-0',
      },
      size: {
        xsmall:
          'py-0 px-[calc(var(--base)*0.3)] text-(length:--base-body-size) leading-[calc(var(--base)*1.2)]',
        small:
          'py-0 px-[calc(var(--base)*0.4)] text-(length:--base-body-size) leading-[calc(var(--base)*1.2)]',
        medium:
          'py-[calc(var(--base)*0.2)] px-[calc(var(--base)*0.6)] text-(length:--base-body-size) leading-[calc(var(--base)*1.2)]',
        large:
          'py-[calc(var(--base)*0.4)] px-[calc(var(--base)*0.8)] text-(length:--base-body-size) leading-[calc(var(--base)*1.2)]',
      },
      iconPosition: {
        left: '',
        right: '',
      },
      hasIcon: {
        true: '',
        false: '',
      },
      iconOnly: {
        true: '',
        false: '',
      },
      round: {
        true: 'rounded-full',
        false: '',
      },
      noMargin: {
        true: 'my-0',
        false: 'my-3',
      },
    },
    compoundVariants: [
      // Icon position adjustments - using CSS variables
      {
        iconPosition: 'left',
        size: 'xsmall',
        hasIcon: true,
        className: 'pl-[calc(var(--base)*0.2)]',
      },
      {
        iconPosition: 'right',
        size: 'xsmall',
        hasIcon: true,
        className: 'pr-[calc(var(--base)*0.2)]',
      },
      {
        iconPosition: 'left',
        size: 'small',
        hasIcon: true,
        className: 'pl-[calc(var(--base)*0.3)]',
      },
      {
        iconPosition: 'right',
        size: 'small',
        hasIcon: true,
        className: 'pr-[calc(var(--base)*0.3)]',
      },
      {
        iconPosition: 'left',
        size: 'medium',
        hasIcon: true,
        className: 'pl-[calc(var(--base)*0.4)]',
      },
      {
        iconPosition: 'right',
        size: 'medium',
        hasIcon: true,
        className: 'pr-[calc(var(--base)*0.4)]',
      },
      {
        iconPosition: 'left',
        size: 'large',
        hasIcon: true,
        className: 'pl-[calc(var(--base)*0.6)]',
      },
      {
        iconPosition: 'right',
        size: 'large',
        hasIcon: true,
        className: 'pr-[calc(var(--base)*0.6)]',
      },
    ],
    defaultVariants: {
      buttonStyle: 'primary',
      size: 'medium',
      iconPosition: 'right',
      hasIcon: false,
      iconOnly: false,
      round: false,
      noMargin: false,
    },
  },
)

// Icon size variants - using CSS variables
const iconSizeVariants = cva('flex items-center justify-center rounded-full', {
  variants: {
    size: {
      xsmall: 'size-[calc(var(--base)*0.8)]',
      small: 'size-[calc(var(--base)*0.9)]',
      medium: 'size-[calc(var(--base)*1.2)]',
      large: 'size-[calc(var(--base)*1.2)]',
    },
    iconStyle: {
      'with-border': 'border border-current',
      'without-border': 'border-transparent',
      none: 'border-transparent',
    },
  },
  defaultVariants: {
    size: 'medium',
    iconStyle: 'without-border',
  },
})

// Content gap variants - using CSS variables
const contentGapVariants = cva('flex items-center justify-center', {
  variants: {
    size: {
      xsmall: 'gap-[calc(var(--base)*0.2)]',
      small: 'gap-[calc(var(--base)*0.2)]',
      medium: 'gap-[calc(var(--base)*0.2)]',
      large: 'gap-[calc(var(--base)*0.4)]',
    },
    iconPosition: {
      left: 'flex-row-reverse',
      right: 'flex-row',
    },
  },
  defaultVariants: {
    size: 'medium',
    iconPosition: 'right',
  },
})

export type PayloadButtonVariants = VariantProps<typeof payloadButtonVariants>

interface ButtonContentsProps {
  children?: React.ReactNode
  icon?: Props['icon']
  showTooltip?: boolean
  tooltip?: string
  size?: Props['size']
  iconPosition?: Props['iconPosition']
  iconStyle?: Props['iconStyle']
}

export const ButtonContents: React.FC<ButtonContentsProps> = ({
  children,
  icon,
  showTooltip,
  tooltip,
  size = 'medium',
  iconPosition = 'right',
  iconStyle = 'without-border',
}) => {
  const BuiltInIcon = typeof icon === 'string' ? icons[icon as keyof typeof icons] : null

  return (
    <Fragment>
      {tooltip && (
        <Tooltip className="absolute" show={showTooltip}>
          {tooltip}
        </Tooltip>
      )}
      <span className={cn(contentGapVariants({ size, iconPosition }))}>
        {children && <span>{children}</span>}
        {icon && (
          <span
            className={cn(
              iconSizeVariants({ size, iconStyle }),
              '[&_svg]:size-full [&_.stroke]:stroke-current [&_.stroke]:fill-none [&_.fill]:fill-current',
            )}
          >
            {isValidElement(icon) && icon}
            {BuiltInIcon && <BuiltInIcon />}
          </span>
        )}
      </span>
    </Fragment>
  )
}

export const Button: React.FC<Props> = (props) => {
  const {
    id,
    type = 'button',
    'aria-label': ariaLabel,
    buttonStyle = 'primary',
    children,
    className,
    disabled,
    el = 'button',
    enableSubMenu,
    extraButtonProps = {},
    icon,
    iconPosition = 'right',
    iconStyle = 'without-border',
    margin = true,
    newTab,
    onClick,
    onMouseDown,
    ref,
    round,
    size = 'medium',
    SubMenuPopupContent,
    to,
    tooltip,
    url,
  } = props

  const [showTooltip, setShowTooltip] = React.useState(false)

  // Build button classes using CVA
  const buttonClasses = cn(
    payloadButtonVariants({
      buttonStyle: buttonStyle as PayloadButtonVariants['buttonStyle'],
      size,
      iconPosition: icon ? iconPosition : undefined,
      hasIcon: !!icon,
      iconOnly: !!icon && !children,
      round,
      noMargin: !margin,
    }),
    tooltip && 'relative',
    className,
  )

  // Wrapper classes for popup variant
  const wrapperClasses = cn(
    'flex my-1',
    payloadButtonVariants({
      buttonStyle: buttonStyle as PayloadButtonVariants['buttonStyle'],
      size,
      round,
      noMargin: true,
    }),
    // Override padding for wrapper
    'p-0',
  )

  function handleClick(event: React.MouseEvent) {
    setShowTooltip(false)
    if (type !== 'submit' && onClick) {
      event.preventDefault()
    }
    if (onClick) {
      onClick(event)
    }
  }

  const buttonProps = {
    id,
    type,
    'aria-disabled': disabled,
    'aria-label': ariaLabel,
    className: !SubMenuPopupContent
      ? buttonClasses
      : cn(
          buttonClasses,
          SubMenuPopupContent && 'rounded-r-none rtl:rounded-r-sm rtl:rounded-l-none',
        ),
    disabled,
    onClick: !disabled ? handleClick : undefined,
    onMouseDown: !disabled ? onMouseDown : undefined,
    onPointerEnter: tooltip ? () => setShowTooltip(true) : undefined,
    onPointerLeave: tooltip ? () => setShowTooltip(false) : undefined,
    rel: newTab ? 'noopener noreferrer' : undefined,
    target: newTab ? '_blank' : undefined,
    title: ariaLabel,
    ...extraButtonProps,
  }

  const contentsProps = {
    icon,
    showTooltip,
    tooltip,
    size,
    iconPosition,
    iconStyle,
  }

  let buttonElement

  switch (el) {
    case 'anchor':
      buttonElement = (
        <a
          {...buttonProps}
          href={!disabled ? url : undefined}
          ref={ref as React.RefObject<HTMLAnchorElement>}
        >
          <ButtonContents {...contentsProps}>{children}</ButtonContents>
        </a>
      )
      break

    case 'link':
      if (disabled) {
        buttonElement = (
          <div {...buttonProps}>
            <ButtonContents {...contentsProps}>{children}</ButtonContents>
          </div>
        )
        break
      }

      // Extract only Link-compatible props
      const { type: _type, ...linkCompatibleProps } = buttonProps
      buttonElement = (
        <Link {...linkCompatibleProps} href={to || url || ''} prefetch={false}>
          <ButtonContents {...contentsProps}>{children}</ButtonContents>
        </Link>
      )
      break

    default:
      const Tag = el // eslint-disable-line no-case-declarations

      buttonElement = (
        <Tag ref={ref} {...buttonProps}>
          <ButtonContents {...contentsProps}>{children}</ButtonContents>
        </Tag>
      )
      break
  }

  if (SubMenuPopupContent) {
    return (
      <div className={wrapperClasses}>
        {buttonElement}
        <Popup
          button={<ChevronIcon />}
          buttonSize={size}
          className={cn(
            'flex items-center rounded-sm rounded-l-none rtl:rounded-l-sm rtl:rounded-r-none',
            'border-l border-background rtl:border-l-0 rtl:border-r',
            disabled && !enableSubMenu && 'opacity-50 cursor-not-allowed',
          )}
          disabled={disabled && !enableSubMenu}
          horizontalAlign="right"
          id={`${id}-popup`}
          noBackground
          render={({ close }) => SubMenuPopupContent({ close: () => close() })}
          size="large"
          verticalAlign="bottom"
        />
      </div>
    )
  }

  return buttonElement
}
