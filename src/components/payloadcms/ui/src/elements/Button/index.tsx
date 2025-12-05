'use client'
import React, { Fragment, isValidElement } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import type { Props } from './types.js'

import { cn } from '@/lib/utils'
import { ChevronIcon } from '../../icons/Chevron/index.js'
import { EditIcon } from '../../icons/Edit/index.js'
import { LinkIcon } from '../../icons/Link/index.js'
import { PlusIcon } from '../../icons/Plus/index.js'
import { SwapIcon } from '../../icons/Swap/index.js'
import { XIcon } from '../../icons/X/index.js'
import { Link } from '../Link/index.js'
import { Popup } from '../Popup/index.js'
import { Tooltip } from '../Tooltip/index.js'

const icons = {
  chevron: ChevronIcon,
  edit: EditIcon,
  link: LinkIcon,
  plus: PlusIcon,
  swap: SwapIcon,
  x: XIcon,
}

// Button variants using CVA
export const payloadButtonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center',
    'rounded-sm font-normal',
    'border-0 cursor-pointer no-underline',
    'transition-all duration-100 ease-out',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2',
  ],
  {
    variants: {
      buttonStyle: {
        primary: [
          'bg-foreground/80 text-background',
          'hover:bg-foreground/60',
          'disabled:bg-border disabled:text-foreground/80 disabled:cursor-not-allowed',
        ],
        secondary: [
          'bg-transparent text-foreground',
          'shadow-[inset_0_0_0_1px_hsl(var(--foreground)/0.8)]',
          'hover:text-muted-foreground hover:shadow-[inset_0_0_0_1px_hsl(var(--muted-foreground)/0.4)]',
          'disabled:text-border disabled:shadow-[inset_0_0_0_1px_hsl(var(--border))] disabled:cursor-not-allowed',
        ],
        pill: [
          'bg-muted text-foreground/80',
          'hover:bg-muted/80',
          'disabled:text-muted-foreground disabled:cursor-not-allowed',
        ],
        'icon-label': [
          'p-0 font-semibold',
          'bg-transparent text-foreground',
          'hover:text-muted-foreground',
          'disabled:text-border disabled:cursor-not-allowed',
        ],
        subtle: [
          'bg-muted text-foreground',
          'shadow-[inset_0_0_0_1px_hsl(var(--border))]',
          'hover:bg-muted/80 hover:shadow-[inset_0_0_0_1px_hsl(var(--border)/0.8)]',
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
          'hover:bg-muted/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ],
        none: 'p-0',
      },
      size: {
        xsmall: 'text-xs py-0 px-1',
        small: 'text-sm py-0 px-1.5',
        medium: 'text-sm py-0.5 px-2.5',
        large: 'text-sm py-1 px-3',
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
      // Icon position adjustments
      { iconPosition: 'left', size: 'small', className: 'pl-1' },
      { iconPosition: 'right', size: 'small', className: 'pr-1' },
      { iconPosition: 'left', size: 'xsmall', className: 'pl-0.5' },
      { iconPosition: 'right', size: 'xsmall', className: 'pr-0.5' },
      { iconPosition: 'left', size: 'medium', className: 'pl-1.5' },
      { iconPosition: 'right', size: 'medium', className: 'pr-1.5' },
      { iconPosition: 'left', size: 'large', className: 'pl-2' },
      { iconPosition: 'right', size: 'large', className: 'pr-2' },
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

// Icon size variants
const iconSizeVariants = cva('flex items-center justify-center rounded-full', {
  variants: {
    size: {
      xsmall: 'size-3.5',
      small: 'size-4',
      medium: 'size-5',
      large: 'size-5',
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

// Content gap variants
const contentGapVariants = cva('flex items-center justify-center', {
  variants: {
    size: {
      xsmall: 'gap-0.5',
      small: 'gap-0.5',
      medium: 'gap-0.5',
      large: 'gap-1',
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
