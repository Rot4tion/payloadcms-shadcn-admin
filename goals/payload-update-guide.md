# Payload CMS Local Components Update Guide

## Quick Start

```
Update local Payload CMS components using @goals/payload-component-update-guide.md

Current Version: [CURRENT]
Target Version: [TARGET]
```

---

## Paths

| Type | Path |
|------|------|
| **Local** | `src/components/payloadcms/{next,ui}/` |
| **Upstream** | `ai-docs/payload/packages/{next,ui}/src/` |

---

## Update Process

### 1. Fetch & Analyze

```bash
cd ai-docs/payload
git fetch upstream --tags
git log v[FROM]..v[TO] --oneline --no-merges -- packages/next packages/ui
```

### 2. Filter Changes

**✅ APPLY:**
- Security fixes
- Bug fixes (race conditions, data loss, NaN errors)
- New utility functions/hooks
- Type fixes

**❌ SKIP:**
- SCSS/CSS style changes (we use TailwindCSS)
- Minor UI tweaks
- Refactoring without functional change

**🆕 NEW FEATURES:**
- If feature is NEW and has no existing local file → Create with TailwindCSS
- If feature modifies existing file → Apply logic only, convert styles to Tailwind

### 3. Apply Changes

```bash
# View diff for specific file
git diff v[FROM]..v[TO] -- packages/[ui|next]/src/[path]

# Get new file content
git show v[TO]:packages/[ui|next]/src/[path]
```

---

## Rules

### Style Handling

| Scenario | Action |
|----------|--------|
| Upstream SCSS change | **SKIP** - Keep existing Tailwind |
| New component with SCSS | **CREATE** with TailwindCSS instead |
| Logic change + style change | **APPLY** logic only, ignore styles |
| New CSS class for state | Add class in TSX, style with Tailwind |

### TailwindCSS Conversion

```typescript
// Use cn() for conditional classes
const classNames = cn(
  'flex flex-col gap-2',
  hasErrors ? 'text-destructive' : 'text-foreground'
)
```

### Common Fixes Pattern

```typescript
// Race condition fix: Remove refs, use direct values
// Before: valueRef.current
// After: value

// NaN fix: Add fallback
// Before: (arr[key] + 1)
// After: ((arr[key] || 0) + 1)

// New imports from payload/shared
import { newHelper } from 'payload/shared'
```

---

## High-Priority Files

| File | Watch For |
|------|-----------|
| `ui/elements/Autosave/index.tsx` | Race conditions |
| `ui/forms/Form/index.tsx` | Form state bugs |
| `ui/fields/Relationship/Input.tsx` | Pagination issues |
| `ui/providers/*` | Context changes |
| `next/utilities/*` | New helpers |

---

## Checklist

After update:
- [ ] No new TypeScript errors
- [ ] Autosave works
- [ ] Forms validate correctly
- [ ] Relationships load properly

---

## Version History

| Date | From → To | Changes |
|------|-----------|---------|
| 2025-12-07 | 3.65.0 → 3.67.0 | ✅ Autosave race condition fix, Block error style inheritance, SelectMany translation, Helper functions (hasDraftsEnabled, hasAutosaveEnabled) |
