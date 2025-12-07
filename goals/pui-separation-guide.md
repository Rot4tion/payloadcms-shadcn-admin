# PUI Separation Guide: Separating Logic from Presentation

> **Goal**: Convert components from monolithic to Headless (Logic) + Skin (UI) pattern
> to support multi-theme and easier maintenance.

---

## 📋 Overview

### Before (Monolithic)

```
Button/
└── index.tsx    # Logic + UI mixed together
```

### After (Separated)

```
Button/
├── usePUIButton.ts   # 🔵 Logic hook (shared across themes)
├── types.ts          # 🔵 Types (shared)
└── index.tsx         # 🟢 Default skin (UI only)
```

---

## 🎯 Naming Convention

| Item           | Pattern     | Example                       |
| -------------- | ----------- | ----------------------------- |
| Logic hooks    | `usePUI*`   | `usePUIButton`, `usePUIModal` |
| Types          | `PUI*Props` | `PUIButtonProps`              |
| Internal utils | `pui*`      | `puiFormatDate`               |
| Components     | Keep as-is  | `Button`, `Modal`             |

---

## 📐 Hook Structure

### Template for `usePUI*.ts`

```tsx
// src/components/payloadcms/ui/elements/[Component]/usePUI[Component].ts
import { useState, useCallback, useMemo } from 'react'
import type { [Component]Props } from './types'

export interface UsePUI[Component]Return {
  // State
  // Handlers
  // Computed values
}

export function usePUI[Component](props: [Component]Props): UsePUI[Component]Return {
  // 1. Destructure props
  const {
    disabled,
    onClick,
    // ...
  } = props

  // 2. Internal state
  const [internalState, setInternalState] = useState(false)

  // 3. Handlers (useCallback for stability)
  const handleClick = useCallback((event: React.MouseEvent) => {
    if (disabled) return
    onClick?.(event)
  }, [disabled, onClick])

  // 4. Computed values (useMemo if expensive)
  const computedValue = useMemo(() => {
    // ...
  }, [/* deps */])

  // 5. Return everything UI needs
  return {
    // State
    internalState,

    // Handlers
    handleClick,

    // Computed
    computedValue,

    // Pass-through props UI might need
    disabled,
  }
}
```

---

## 🔄 Conversion Process for Each Component

### Step 1: Analyze Current Component

1. Open component file (e.g., `Button/index.tsx`)
2. Identify:
   - [ ] State (`useState`, `useReducer`)
   - [ ] Side effects (`useEffect`)
   - [ ] Event handlers (`onClick`, `onChange`, etc.)
   - [ ] Computed values
   - [ ] External hooks being used (`usePathname`, `useParams`, etc.)

### Step 2: Create `usePUI*.ts` file

```bash
# Create new file
touch src/components/payloadcms/ui/elements/[Component]/usePUI[Component].ts
```

### Step 3: Extract Logic

**Move the following into hook:**

| From Component                         | To Hook              |
| -------------------------------------- | -------------------- |
| `const [state, setState] = useState()` | ✅ Move              |
| `useEffect(() => {})`                  | ✅ Move              |
| `const handleClick = () => {}`         | ✅ Move              |
| `const computed = useMemo()`           | ✅ Move              |
| `usePathname()`, `useParams()`         | ✅ Move              |
| `className={cn(...)}`                  | ❌ Keep in component |
| JSX structure                          | ❌ Keep in component |
| Style-related logic                    | ❌ Keep in component |

### Step 4: Update Component to Use Hook

```tsx
// BEFORE
export const Button = (props) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const handleClick = () => {
    /* logic */
  }

  return <button onClick={handleClick}>...</button>
}

// AFTER
import { usePUIButton } from './usePUIButton'

export const Button = (props) => {
  const { showTooltip, handleClick } = usePUIButton(props)

  return <button onClick={handleClick}>...</button>
}
```

### Step 5: Test

```bash
# Ensure no regressions
pnpm dev
# Test component behavior
```

### Step 6: Document

Add JSDoc for hook:

````tsx
/**
 * Logic hook for Button component
 *
 * @example
 * ```tsx
 * const { handleClick, showTooltip } = usePUIButton(props)
 * ```
 */
export function usePUIButton(props: ButtonProps) {
  // ...
}
````

---

## 📝 Checklist for Each Component

```markdown
## Component: [Name]

- [ ] Analyzed current implementation
- [ ] Created `usePUI[Name].ts`
- [ ] Extracted state
- [ ] Extracted handlers
- [ ] Extracted effects
- [ ] Extracted computed values
- [ ] Updated component to use hook
- [ ] Tested functionality
- [ ] Added JSDoc
- [ ] No TypeScript errors
```

---

## 🎨 Component Classification

### Priority 1: Core Elements (Most used)

- [ ] `Button` - Button
- [ ] `Modal` - Dialog/Modal
- [ ] `Drawer` - Side drawer
- [ ] `Popup` - Popover/Dropdown
- [ ] `Table` - Data table
- [ ] `Pagination` - Pagination

### Priority 2: Form Elements

- [ ] `Input` (if custom)
- [ ] `Select`
- [ ] `Checkbox`
- [ ] `DatePicker`
- [ ] `ReactSelect`

### Priority 3: Layout Components

- [ ] `Nav` - Navigation
- [ ] `AppHeader` - App header
- [ ] `Collapsible` - Accordion
- [ ] `Card` - Card container

### Priority 4: Complex Views

- [ ] `ListView` - List view
- [ ] `EditView` - Edit view
- [ ] `DocumentHeader` - Doc header with tabs

### Skip (No need to separate)

- Simple presentational components (icons, badges, etc.)
- Components without logic (pure UI)

---

## 🚨 Important Notes

### 1. Don't break existing API

```tsx
// Component props DON'T change
// User still uses: <Button onClick={} disabled />
```

### 2. Hook must be stable

```tsx
// ❌ BAD - creates new function every render
const handleClick = () => {}

// ✅ GOOD - stable reference
const handleClick = useCallback(() => {}, [deps])
```

### 3. Handle Server Components

```tsx
// If component needs to be Server Component:
// - Hook only for Client Components
// - Split into .server.tsx and .client.tsx if needed
```

### 4. Type Safety

```tsx
// Export return type of hook
export type UsePUIButtonReturn = ReturnType<typeof usePUIButton>

// For theme skins to have type safety
const state: UsePUIButtonReturn = usePUIButton(props)
```

---

## 📊 Conversion Example: Button Component

### Original file: `Button/index.tsx` (simplified)

```tsx
'use client'
export const Button = (props) => {
  const { onClick, disabled, tooltip, children } = props
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = (e) => {
    setShowTooltip(false)
    onClick?.(e)
  }

  return (
    <button
      disabled={disabled}
      onClick={!disabled ? handleClick : undefined}
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={cn('btn', disabled && 'btn-disabled')}
    >
      {tooltip && showTooltip && <Tooltip>{tooltip}</Tooltip>}
      {children}
    </button>
  )
}
```

### After separation:

**`usePUIButton.ts`**

```tsx
import { useState, useCallback } from 'react'
import type { ButtonProps } from './types'

export interface UsePUIButtonReturn {
  showTooltip: boolean
  handleClick: ((e: React.MouseEvent) => void) | undefined
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  disabled: boolean | undefined
}

export function usePUIButton(props: ButtonProps): UsePUIButtonReturn {
  const { onClick, disabled, tooltip } = props
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      setShowTooltip(false)
      onClick?.(e)
    },
    [onClick],
  )

  const handleMouseEnter = useCallback(() => {
    if (tooltip) setShowTooltip(true)
  }, [tooltip])

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false)
  }, [])

  return {
    showTooltip,
    handleClick: !disabled ? handleClick : undefined,
    handleMouseEnter,
    handleMouseLeave,
    disabled,
  }
}
```

**`index.tsx`** (Updated)

```tsx
'use client'
import { usePUIButton } from './usePUIButton'
import type { ButtonProps } from './types'
import { cn } from '@/lib/utils'

export const Button = (props: ButtonProps) => {
  const { children, tooltip, className } = props
  const { showTooltip, handleClick, handleMouseEnter, handleMouseLeave, disabled } =
    usePUIButton(props)

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('btn', disabled && 'btn-disabled', className)}
    >
      {tooltip && showTooltip && <Tooltip>{tooltip}</Tooltip>}
      {children}
    </button>
  )
}
```

## 📈 Tracking Progress

| Component | Hook Created | Tested | Documented |
| --------- | ------------ | ------ | ---------- |
| Button    | ⬜           | ⬜     | ⬜         |
| Modal     | ⬜           | ⬜     | ⬜         |
| Drawer    | ⬜           | ⬜     | ⬜         |
| Popup     | ⬜           | ⬜     | ⬜         |
| Table     | ⬜           | ⬜     | ⬜         |
| Nav       | ⬜           | ⬜     | ⬜         |
| ...       | ...          | ...    | ...        |

---
