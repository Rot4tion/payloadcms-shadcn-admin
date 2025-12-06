# PayloadCMS → Shadcn + TailwindCSS Migration Guide

> **AI Instructions**: This document defines STRICT rules for converting PayloadCMS components to TailwindCSS. Follow ALL rules without exception. When in doubt, reference the original SCSS file in `ai-docs/payload/packages/`.

---

## 🚨 CRITICAL RULES (MUST FOLLOW)

### Rule 1: ALWAYS Use TailwindCSS, NEVER Inline Styles
```tsx
// ❌ NEVER - Inline styles
style={{ padding: '20px', margin: '10px' }}
style={{ width: '300px' }}

// ✅ ALWAYS - Tailwind classes (use arbitrary values for CSS variables)
className="p-5 m-2.5"
className="w-[300px]"

// ✅ EXCEPTION - Only use style for CSS variables that MUST be dynamic
style={{ 
  '--nav-width': navOpen ? '300px' : '0px'  // CSS custom property
}}
```

### Rule 2: PayloadCMS Breakpoints → Tailwind
```
SCSS @include small-break  = max-width: 768px  → Tailwind: max-md:
SCSS @include mid-break    = max-width: 1024px → Tailwind: max-lg:
SCSS @include large-break  = max-width: 1440px → Tailwind: max-xl:
```

```tsx
// ❌ WRONG breakpoints
className="sm:flex"       // 640px - NOT PayloadCMS
className="max-sm:block"  // 640px - NOT PayloadCMS

// ✅ CORRECT breakpoints
className="max-md:block"   // < 768px (small-break)
className="max-lg:flex"    // < 1024px (mid-break)  
className="lg:flex"        // >= 1024px
className="md:flex"        // >= 768px
```

### Rule 3: CSS Variables → Tailwind Arbitrary Values
```tsx
// Original SCSS uses CSS variables like:
// padding: var(--gutter-h)
// margin-top: calc(var(--base) * 0.4)
// height: var(--app-header-height)

// ✅ CORRECT - Use Tailwind arbitrary values
className="px-(--gutter-h)"
className="mt-[calc(var(--base)*0.4)]"
className="h-(--app-header-height)"

// ✅ For complex calc(), use arbitrary values
className="pt-[calc(var(--base)*1.5)]"      // 30px
className="pb-(--spacing-view-bottom)"
className="gap-[calc(var(--base)/2)]"       // 10px
```

### Rule 4: Theme Colors ONLY
```tsx
// ❌ NEVER hardcoded colors
className="text-[#333] bg-white"
className="text-blue-600 bg-red-100"
style={{ color: 'var(--theme-elevation-1000)' }}

// ✅ ALWAYS theme colors
className="text-foreground bg-background"
className="text-muted-foreground bg-muted"
className="text-primary bg-primary"
className="text-destructive bg-destructive/10"
className="border-border"
```

### Rule 5: Use `cn()` for Conditional Classes
```tsx
// ❌ WRONG
className={[baseClass, isActive && 'active'].filter(Boolean).join(' ')}
className={`${baseClass} ${baseClass}--variant`}

// ✅ CORRECT
import { cn } from '@/lib/utils'
className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)}
```

### Rule 6: Remove SCSS Imports & baseClass Pattern
```tsx
// ❌ REMOVE these
import './index.scss'
const baseClass = 'component-name'
className={`${baseClass}__element`}

// ✅ REPLACE with Tailwind
className="flex items-center gap-2"
```

---

## 📐 LAYOUT PATTERNS

### Sidebar + Main (Document Edit View)
```tsx
// Desktop: side by side | Mobile (< 1024px): stacked
<div className="w-full flex max-lg:block overflow-x-hidden">
  {/* Main - 66.66% desktop, 100% mobile */}
  <div className="w-[66.66%] max-lg:w-full flex flex-col min-h-full grow">
    <div className={cn(
      'grow overflow-x-hidden',
      hasSidebar && 'border-r border-border max-lg:border-r-0'
    )}>
      {/* Content */}
    </div>
  </div>
  
  {/* Sidebar - 33.33% desktop, 100% mobile (below main) */}
  {hasSidebar && (
    <div className={cn(
      'w-[33.33%] sticky shrink-0',
      'max-lg:w-full max-lg:static max-lg:h-auto'
    )}
    style={{
      top: 'var(--doc-controls-height)',
      height: 'calc(100vh - var(--doc-controls-height))',
      minWidth: '325px'
    }}>
      {/* Sidebar content */}
    </div>
  )}
</div>
```

### Navigation Hamburger (Only ONE visible)
```tsx
// Desktop (>= 768px): Hamburger in main area
<NavToggler className="flex items-center max-md:hidden">
  <NavHamburger />
</NavToggler>

// Mobile (< 768px): Hamburger in header
<NavToggler className="hidden max-md:flex items-center">
  <Hamburger />
</NavToggler>

// Mobile close button (inside nav, < 768px only)
<button className="hidden max-md:flex items-center">
  <Hamburger isActive />
</button>
```

### Sticky Elements
```tsx
// Doc controls - sticky top
className="sticky top-0 z-10"

// Sidebar - sticky with offset, static on mobile
className="sticky max-lg:static"
style={{ top: 'var(--doc-controls-height)' }}

// Nav wrapper
className="sticky top-[var(--app-header-height)]"
```

### Border/Divider (Replace ::after)
```tsx
// Original SCSS uses ::after for dividers
// ✅ Use absolute div instead
<div className="relative">
  {/* Content */}
  <div className="absolute h-px bg-border w-full left-0 top-full" />
</div>
```

---

## 📝 TYPOGRAPHY

### Heading Sizes (Match Original SCSS)
```tsx
// h1: base(1.6) = 32px, line-height: base(1.8) = 36px
className="text-[32px] leading-normal font-medium max-md:text-[25px] max-md:tracking-tight"

// h2: base(1.3) = 26px
className="text-[26px] leading-tight font-medium max-md:text-[17px]"

// h3: base(1) = 20px
className="text-xl leading-snug font-medium max-md:text-[13px]"

// h4: base(0.8) = 16px
className="text-base leading-tight font-medium tracking-tight"
```

---

## 🎨 THEME COLOR MAPPING

| PayloadCMS Variable | Tailwind Class |
|---------------------|----------------|
| `--theme-elevation-0` | `bg-background` |
| `--theme-elevation-100` | `bg-muted` / `border-border` |
| `--theme-elevation-500` | `text-muted-foreground` |
| `--theme-elevation-1000` | `text-foreground` |
| `--theme-bg` | `bg-background` |
| `--theme-text` | `text-foreground` |
| `--theme-error-500` | `text-destructive` |
| `--theme-success-500` | `text-green-600 dark:text-green-400` |

---

## 🔧 CSS VARIABLES REFERENCE

```tsx
// PayloadCMS CSS variables (use in Tailwind arbitrary values)
'--base'                    // 20px - base unit
'--gutter-h'                // horizontal gutter (responsive)
'--app-header-height'       // header height
'--nav-width'               // navigation width  
'--doc-controls-height'     // document controls height
'--spacing-view-bottom'     // bottom spacing for views

// Usage in Tailwind
className="px-[var(--gutter-h)]"
className="h-[var(--app-header-height)]"
className="pt-[calc(var(--base)*1.5)]"
className="gap-[calc(var(--base)/2)]"
```

---

## ✅ PRE-COMMIT CHECKLIST

Before committing converted component:
- [ ] Removed `import './index.scss'`
- [ ] Removed `const baseClass = '...'`
- [ ] No inline `style={{}}` except for CSS custom properties
- [ ] Using `cn()` for conditional classes
- [ ] Using theme colors (not hardcoded)
- [ ] Correct breakpoints (`max-md:`, `max-lg:`, not `sm:`, `max-sm:`)
- [ ] Layout matches original SCSS exactly
- [ ] Responsive behavior matches original
- [ ] No `overflow-hidden` that clips content (use `overflow-x-hidden`)

---

## 📊 MIGRATION PROGRESS

### Phase 1: Core UI ✅
| Component | Status |
|-----------|--------|
| Button, Card, Modal, Drawer | ✅ Done |
| Popup, Table, Pagination | ✅ Done |
| Collapsible, Tabs | ✅ Done |

### Phase 2: Graphics & Icons ✅
| Component | Status |
|-----------|--------|
| PayloadIcon, PayloadLogo | ✅ Done |
| Account, File icons | ✅ Done |

### Phase 3: Form Fields ✅
| Field | Status |
|-------|--------|
| Array, Blocks, Checkbox | ✅ Done |
| DateTime, Email, Group | ✅ Done |
| Number, Password, Point | ✅ Done |
| RadioGroup, Relationship | ✅ Done |
| RichText, Row, Upload | ✅ Done |
| Select, Slug, Tabs, Text, Textarea | ✅ Done |

### Phase 4: Layout & Views ✅
| Component | Status |
|-----------|--------|
| DefaultTemplate, Wrapper | ✅ Done |
| Nav, NavWrapper, NavHamburger | ✅ Done |
| DocumentHeader, DocumentTabs, Tab | ✅ Done |
| FormHeader | ✅ Done |
| DocumentControls | ⏳ Keep SCSS (complex) |
| Login, List, Document views | ✅ Done |
| Dashboard, NotFound, Unauthorized | ✅ Done |
| Account Settings | ✅ Done |
| API View, Version views | ⏳ Keep SCSS (complex) |

---

## 🔗 SHADCN COMPONENTS

Use these from `src/components/ui/`:
- **Inputs**: `input`, `textarea`, `checkbox`, `radio-group`, `select`, `switch`
- **Buttons**: `button`, `toggle`, `toggle-group`
- **Layout**: `card`, `separator`, `tabs`, `accordion`, `collapsible`
- **Overlay**: `dialog`, `drawer`, `sheet`, `popover`, `tooltip`, `dropdown-menu`
- **Feedback**: `alert`, `badge`, `progress`, `skeleton`, `spinner`
- **Navigation**: `breadcrumb`, `pagination`
- **Data**: `table`, `calendar`

### Shadcn Rules
```tsx
// ❌ NEVER modify src/components/ui/ files
// ✅ Only modify src/components/payloadcms/ files

// ❌ Don't add duplicate close buttons (shadcn has them)
// ✅ Use aria-invalid for error states on Input
<Input aria-invalid={showError} />

// ✅ Always include DialogTitle for accessibility
<DialogContent aria-describedby={undefined}>
  <DialogTitle className="sr-only">Modal</DialogTitle>
  {children}
</DialogContent>
```

---

## 🎨 SVG ICONS

```tsx
// ❌ WRONG
<svg fill="var(--theme-elevation-1000)" width="25" height="25">

// ✅ CORRECT
<svg className={cn('size-5 fill-current text-foreground', className)} viewBox="0 0 25 25">
  <path d="..." />
</svg>
```

---

## 📋 QUICK REFERENCE

### Breakpoints
| SCSS | Tailwind |
|------|----------|
| `@include small-break` (< 768px) | `max-md:` |
| `@include mid-break` (< 1024px) | `max-lg:` |
| `@include large-break` (< 1440px) | `max-xl:` |

### Common CSS Variables → Tailwind
```tsx
className="px-[var(--gutter-h)]"
className="h-[var(--app-header-height)]"
className="pt-[calc(var(--base)*1.5)]"
className="gap-[calc(var(--base)/2)]"
className="top-[var(--doc-controls-height)]"
```

### Theme Colors
| Use | Class |
|-----|-------|
| Primary text | `text-foreground` |
| Secondary text | `text-muted-foreground` |
| Background | `bg-background` |
| Muted background | `bg-muted` |
| Border | `border-border` |
| Error | `text-destructive` |
| Focus ring | `ring-ring` |
