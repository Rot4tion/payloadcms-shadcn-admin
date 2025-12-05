# PayloadCMS to Shadcn UI Migration Plan

## Overview
- **Total TSX files**: 512
- **Total SCSS files**: 281
- **Estimated effort**: Large (multi-session project)

---

## Phase 1: Foundation - Core UI Components (Priority: Critical)
**Status**: 🔄 In Progress

### 1.1 Already Converted ✅
| Component | Path | Status |
|-----------|------|--------|
| PayloadIcon | `ui/src/graphics/Icon` | ✅ Done |
| PayloadLogo | `ui/src/graphics/Logo` | ✅ Done |
| DefaultAccountIcon | `ui/src/graphics/Account/Default` | ✅ Done |
| StepNav | `ui/src/elements/StepNav` | ✅ Done |
| ProgressBar | `ui/src/providers/RouteTransition/ProgressBar` | ✅ Done |
| ThemeProvider | `ui/src/providers/Theme` | ✅ Done (syncs with Shadcn) |
| Banner | `ui/src/elements/Banner` | ✅ Done |
| Pill | `ui/src/elements/Pill` | ✅ Done |
| LoadingOverlay | `ui/src/elements/Loading` | ✅ Done |
| Gutter | `ui/src/elements/Gutter` | ✅ Done |
| Tooltip | `ui/src/elements/Tooltip` | ✅ Done |
| Dashboard | `next/src/views/Dashboard/Default` | ✅ Done |

### 1.2 Critical - Converted ✅
| Component | Path | Shadcn Equivalent | Status |
|-----------|------|-------------------|--------|
| Button | `ui/src/elements/Button` | CVA + Tailwind | ✅ Done |
| Card | `ui/src/elements/Card` | Tailwind | ✅ Done |
| Modal | `ui/src/elements/Modal` | shadcn/dialog | ✅ Done |
| Drawer | `ui/src/elements/Drawer` | shadcn/sheet | ✅ Done |
| Popup | `ui/src/elements/Popup` | shadcn/popover | ✅ Done |
| Table | `ui/src/elements/Table` | shadcn/table | ⏳ Pending |
| Pagination | `ui/src/elements/Pagination` | Custom | ⏳ Pending |
| ConfirmationModal | `ui/src/elements/ConfirmationModal` | Tailwind | ✅ Done |
| FullscreenModal | `ui/src/elements/FullscreenModal` | Custom Modal | ✅ Done |

### 1.3 Medium Priority
| Component | Path | Shadcn Equivalent |
|-----------|------|-------------------|
| Collapsible | `ui/src/elements/Collapsible` | shadcn/collapsible |
| Tabs | `ui/src/fields/Tabs` | shadcn/tabs |
| Select | `ui/src/fields/Select` | shadcn/select |
| Checkbox | `ui/src/fields/Checkbox` | shadcn/checkbox | ✅ Done |
| RadioGroup | `ui/src/fields/RadioGroup` | shadcn/radio-group | ✅ Done |
| Switch | N/A | shadcn/switch |
| Input | `ui/src/fields/Text` | shadcn/input |
| Textarea | `ui/src/fields/Textarea` | shadcn/textarea |

---

## Phase 2: Graphics & Icons
**Status**: ⏳ Pending

### 2.1 Graphics (8 items)
| Item | Path | Action |
|------|------|--------|
| Account | `ui/src/graphics/Account` | ✅ Done |
| File | `ui/src/graphics/File` | Convert to Tailwind |
| Icon | `ui/src/graphics/Icon` | ✅ Done |
| Logo | `ui/src/graphics/Logo` | ✅ Done |
| Swap | `ui/src/graphics/Swap` | Convert to Tailwind |

### 2.2 Icons (62 items)
**Strategy**: Replace with Lucide icons where possible
- Most PayloadCMS icons can be replaced with Lucide equivalents
- Keep custom icons, convert to Tailwind styling

---

## Phase 3: Form Fields
**Status**: ⏳ Pending

### 3.1 Core Fields (31 directories)
| Field | Path | Shadcn/Strategy |
|-------|------|-----------------|
| Array | `ui/src/fields/Array` | Custom with shadcn components |
| Blocks | `ui/src/fields/Blocks` | Custom with shadcn components |
| Checkbox | `ui/src/fields/Checkbox` | shadcn/checkbox | ✅ Done |
| Code | `ui/src/fields/Code` | Keep Monaco, style container |
| DateTime | `ui/src/fields/DateTime` | shadcn/date-picker | ✅ Done |
| Email | `ui/src/fields/Email` | shadcn/input | ✅ Done |
| Group | `ui/src/fields/Group` | Custom layout | ✅ Done |
| JSON | `ui/src/fields/JSON` | Keep Monaco, style container |
| Number | `ui/src/fields/Number` | shadcn/input type=number | ✅ Done |
| Password | `ui/src/fields/Password` | shadcn/input type=password | ✅ Done |
| Point | `ui/src/fields/Point` | Custom | ✅ Done |
| RadioGroup | `ui/src/fields/RadioGroup` | shadcn/radio-group | ✅ Done |
| Relationship | `ui/src/fields/Relationship` | shadcn/combobox |
| RichText | `ui/src/fields/RichText` | Keep Lexical, style container |
| Row | `ui/src/fields/Row` | Tailwind flex/grid |
| Select | `ui/src/fields/Select` | shadcn/select |
| Slug | `ui/src/fields/Slug` | shadcn/input + custom |
| Tabs | `ui/src/fields/Tabs` | shadcn/tabs |
| Text | `ui/src/fields/Text` | shadcn/input |
| Textarea | `ui/src/fields/Textarea` | shadcn/textarea |
| Upload | `ui/src/fields/Upload` | Custom with shadcn |

### 3.2 Form Components
| Component | Path | Strategy |
|-----------|------|----------|
| FieldDescription | `ui/src/fields/FieldDescription` | Tailwind text styling |
| FieldError | `ui/src/fields/FieldError` | Tailwind text-destructive |
| FieldLabel | `ui/src/fields/FieldLabel` | shadcn/label |

---

## Phase 4: Layout Components
**Status**: ⏳ Pending

### 4.1 Templates (next/src/templates)
| Template | Status |
|----------|--------|
| Default | 🔄 Partial |
| Minimal | ⏳ Pending |

### 4.2 Layouts (next/src/layouts)
| Layout | Status |
|--------|--------|
| Root | ✅ Done (imports updated) |

### 4.3 Navigation (next/src/elements/Nav)
| Component | Status |
|-----------|--------|
| Nav | 🔄 Partial |
| NavWrapper | ⏳ Pending |
| NavHamburger | ⏳ Pending |
| SettingsMenuButton | ⏳ Pending |

---

## Phase 5: Views (Pages)
**Status**: ⏳ Pending

### 5.1 Auth Views
| View | Path | Priority |
|------|------|----------|
| Login | `next/src/views/Login` | 🔴 High |
| Logout | `next/src/views/Logout` | 🟡 Medium |
| ForgotPassword | `next/src/views/ForgotPassword` | 🟡 Medium |
| ResetPassword | `next/src/views/ResetPassword` | 🟡 Medium |
| CreateFirstUser | `next/src/views/CreateFirstUser` | 🟡 Medium |
| Verify | `next/src/views/Verify` | 🟡 Medium |

### 5.2 Core Views
| View | Path | Priority |
|------|------|----------|
| Dashboard | `next/src/views/Dashboard` | ✅ Done |
| List | `next/src/views/List` | 🔴 High |
| Document | `next/src/views/Document` | 🔴 High |
| Account | `next/src/views/Account` | 🟡 Medium |
| Version | `next/src/views/Version` | 🟢 Low |
| Versions | `next/src/views/Versions` | 🟢 Low |

### 5.3 Other Views
| View | Path | Priority |
|------|------|----------|
| NotFound | `next/src/views/NotFound` | 🟢 Low |
| Unauthorized | `next/src/views/Unauthorized` | 🟢 Low |
| API | `next/src/views/API` | 🟢 Low |

---

## Phase 6: Providers & Utilities
**Status**: ⏳ Pending

### 6.1 Providers (62 items)
| Provider | Status | Notes |
|----------|--------|-------|
| Theme | ✅ Done | Syncs with Shadcn class |
| RouteTransition | ✅ Done | ProgressBar converted |
| Config | ⏳ Keep | No styling needed |
| Auth | ⏳ Keep | No styling needed |
| Translation | ⏳ Keep | No styling needed |

### 6.2 Hooks (18 items)
- Most hooks don't need conversion
- Focus on hooks that return styled components

---

## Phase 7: Cleanup & Testing
**Status**: ⏳ Pending

### 7.1 Remove SCSS Files
- Delete converted `.scss` files
- Update imports to remove SCSS references

### 7.2 Testing Checklist
- [ ] Theme switching works (light/dark)
- [ ] All forms submit correctly
- [ ] Navigation works
- [ ] Modals/Drawers open/close
- [ ] Tables display correctly
- [ ] Pagination works
- [ ] File uploads work
- [ ] Rich text editor works

### 7.3 Performance
- [ ] Bundle size comparison
- [ ] Lighthouse audit

---

## Conversion Guidelines

### 🔴 Critical Rules (MUST FOLLOW)

#### 1. NO Hardcoded Colors
```tsx
// ❌ WRONG - Never do this
<div style={{ color: '#000', background: 'white' }}>
<div className="text-[#333] bg-[#f5f5f5]">
<svg fill="var(--theme-elevation-1000)">
// ❌ WRONG - Hardcoded Tailwind colors (green, blue, red, etc.)
className="ring-green-500/50"
className="text-blue-600"
className="bg-red-100"

// ✅ CORRECT - Always use theme colors
<div className="text-foreground bg-background">
<div className="text-muted-foreground bg-muted">
<svg className="fill-current text-foreground">
// ✅ CORRECT - Use semantic theme colors
className="ring-ring"           // Focus ring
className="text-primary"        // Primary color
className="bg-destructive/10"   // Error background
```

#### 2. NO Hardcoded Sizes (Pixels)
```tsx
// ❌ WRONG
<div style={{ width: '18px', height: '18px' }}>
<svg width="25" height="25">
className="w-[18px] h-[18px]"

// ✅ CORRECT - Use Tailwind size classes
<div className="size-5">        // 20px
<div className="size-6">        // 24px
<div className="h-10 w-auto">   // height 40px, auto width
className="size-4"              // 16px (icons)
className="size-5"              // 20px (small icons)
className="size-6"              // 24px (medium icons)
```

#### 3. Always Use `cn()` Utility
```tsx
// ❌ WRONG
className={[baseClass, isActive && 'active'].filter(Boolean).join(' ')}
className={`${baseClass} ${baseClass}--variant`}

// ✅ CORRECT
import { cn } from '@/lib/utils'
className={cn('base-classes', isActive && 'active-classes', className)}
```

#### 4. Focus States - Use Theme Ring Colors
```tsx
// ❌ WRONG - Hardcoded focus colors
className="focus:ring-green-500"
className="focus-within:ring-blue-400"
className="focus-visible:border-green-600"

// ✅ CORRECT - Use theme ring colors
className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
className="focus-within:ring-2 focus-within:ring-ring"
className="focus:outline-none focus:ring-2 focus:ring-ring"
```

#### 5. Keep Original Animations
```tsx
// ✅ Keep transition classes
className="transition-colors duration-200"
className="transition-opacity duration-150"
className="animate-in fade-in"
className="animate-out fade-out"

// ✅ Keep hover/focus states
className="hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
```

#### 6. Prefer Shadcn Components
```tsx
// ❌ WRONG - Creating custom when shadcn exists
<button className="custom-button">
<input type="checkbox" className="custom-checkbox" />
<input type="text" className="custom-input" />

// ✅ CORRECT - Use shadcn components
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

<Button variant="outline" size="sm">
<Checkbox checked={value} onCheckedChange={handleChange} />
<Input type="email" value={value} onChange={handleChange} aria-invalid={showError} />
<RadioGroupItem value="option1" />
```

#### 7. Use aria-invalid for Error States
```tsx
// ❌ WRONG - Custom error styling
className={showError && 'border-destructive bg-destructive/10'}

// ✅ CORRECT - Use aria-invalid (shadcn Input handles styling)
<Input aria-invalid={showError} />
// Shadcn Input already has: aria-invalid:border-destructive aria-invalid:ring-destructive/20
```

#### 8. Available Shadcn Components
Check `src/components/ui/` for available components:
- **Form inputs**: `input`, `textarea`, `checkbox`, `radio-group`, `select`, `switch`
- **Buttons**: `button`, `toggle`, `toggle-group`
- **Layout**: `card`, `separator`, `tabs`, `accordion`, `collapsible`
- **Overlay**: `dialog`, `drawer`, `sheet`, `popover`, `tooltip`, `dropdown-menu`
- **Feedback**: `alert`, `badge`, `progress`, `skeleton`, `spinner`
- **Navigation**: `breadcrumb`, `pagination`, `navigation-menu`
- **Data**: `table`, `calendar`, `chart`
```

---

### Theme Colors Reference

#### Text Colors
| Tailwind Class | Use For |
|----------------|---------|
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text, placeholders |
| `text-primary` | Emphasized text, links |
| `text-destructive` | Errors, warnings |
| `text-primary-foreground` | Text on primary background |

#### Background Colors
| Tailwind Class | Use For |
|----------------|---------|
| `bg-background` | Main background |
| `bg-muted` | Secondary background, cards |
| `bg-primary` | Buttons, highlights |
| `bg-secondary` | Secondary actions |
| `bg-destructive` | Error states |
| `bg-popover` | Dropdowns, tooltips |

#### Border Colors
| Tailwind Class | Use For |
|----------------|---------|
| `border-border` | Default borders |
| `border-input` | Input borders |
| `border-ring` | Focus rings |
| `border-destructive` | Error borders |

#### Fill Colors (SVG)
| Tailwind Class | Use For |
|----------------|---------|
| `fill-current` | Inherit from text color |
| `fill-foreground` | Primary icons |
| `fill-muted-foreground` | Secondary icons |
| `fill-primary` | Emphasized icons |

---

### PayloadCMS → Tailwind Mapping

| PayloadCMS Variable | Tailwind Equivalent |
|---------------------|---------------------|
| `--theme-elevation-0` | `bg-background` |
| `--theme-elevation-50` | `bg-muted/50` |
| `--theme-elevation-100` | `bg-muted` |
| `--theme-elevation-150` | `bg-muted` |
| `--theme-elevation-200` | `border-border` |
| `--theme-elevation-300` | `bg-accent` |
| `--theme-elevation-400` | `text-muted-foreground/70` |
| `--theme-elevation-500` | `text-muted-foreground` |
| `--theme-elevation-600` | `text-muted-foreground` |
| `--theme-elevation-800` | `text-foreground/80` |
| `--theme-elevation-1000` | `text-foreground` |
| `--theme-success-50` | `bg-green-500/10` |
| `--theme-success-500` | `text-green-600 dark:text-green-400` |
| `--theme-error-50` | `bg-destructive/10` |
| `--theme-error-500` | `text-destructive` |
| `--theme-warning-50` | `bg-yellow-500/10` |
| `--theme-warning-500` | `text-yellow-600 dark:text-yellow-400` |
| `--theme-text` | `text-foreground` |
| `--theme-bg` | `bg-background` |

---

### Component Variants with CVA

```tsx
// ✅ Use class-variance-authority for variants
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base classes (no specific colors)
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'size-10',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
```

---

### SVG Icons Pattern

```tsx
// ❌ WRONG
<svg fill="var(--theme-elevation-1000)" width="25" height="25">

// ✅ CORRECT
<svg 
  className={cn('size-5 fill-current text-foreground', className)}
  viewBox="0 0 25 25"
>
  <path d="..." />  // No fill attribute needed
</svg>

// ✅ With prop to override
export const MyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn('size-5 text-foreground', className)} viewBox="0 0 24 24">
    <path className="fill-current" d="..." />
  </svg>
)
```

---

### Responsive Design

```tsx
// ✅ Mobile-first approach
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
className="text-sm md:text-base"
className="px-4 md:px-6 lg:px-8"
className="hidden md:flex"  // Hide on mobile
className="flex md:hidden"  // Show only on mobile
```

---

### Dark Mode

```tsx
// ✅ Automatic with theme colors (no dark: prefix needed)
className="text-foreground bg-background"  // Auto-switches with theme

// ✅ Only use dark: when different color needed
className="text-green-700 dark:text-green-400"
className="bg-blue-100 dark:bg-blue-900"
```

---

### Pre-Commit Checklist

- [ ] No hardcoded colors (`#xxx`, `rgb()`, `var(--theme-*)`)
- [ ] No hardcoded sizes (`width="20"`, `style={{ width: '20px' }}`)
- [ ] Removed SCSS imports (`import './index.scss'`)
- [ ] Removed `baseClass` pattern
- [ ] Using `cn()` for dynamic classes
- [ ] Using theme colors (foreground, background, primary, etc.)
- [ ] Kept animations/transitions
- [ ] SVG using `fill-current` + `text-*` class

---

## Estimated Timeline

| Phase | Estimated Time | Dependencies |
|-------|----------------|--------------|
| Phase 1 | 2-3 sessions | None |
| Phase 2 | 1 session | Phase 1 |
| Phase 3 | 3-4 sessions | Phase 1, 2 |
| Phase 4 | 1-2 sessions | Phase 1 |
| Phase 5 | 2-3 sessions | Phase 1-4 |
| Phase 6 | 1 session | None |
| Phase 7 | 1 session | All |

**Total Estimated**: 11-15 sessions

---

