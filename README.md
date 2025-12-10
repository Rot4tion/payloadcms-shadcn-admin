# PayloadCMS Shadcn Admin

> **🚧 Work in Progress** - This project is under active development and exploring distribution approaches.

A drop-in replacement UI layer for PayloadCMS built with **TailwindCSS** and **shadcn/ui** components. Create unlimited custom admin panels while keeping the original PayloadCMS admin intact.

## ✨ Key Features

- **Multiple Admin Panels** - Add custom admin interfaces for different user roles without modifying the original PayloadCMS admin
- **Shared Core** - All admin panels share the same PayloadCMS hooks, providers, context, and authentication
- **Modern UI** - Built with TailwindCSS v4 and shadcn/ui components for unlimited customization
- **No Lock-in** - Only replaces UI/layout while keeping all PayloadCMS functionality intact

## 🎯 Use Cases

| Role | Route | UI |
|------|-------|-----|
| **Super Admin** | `/admin` | Original PayloadCMS Admin |
| **Marketplace Seller** | `/store-admin` | Custom Shadcn/TailwindCSS Admin |
| **Blog Author** | `/blog-admin` | Custom Shadcn/TailwindCSS Admin |
| **Customer Support** | `/support-admin` | Custom Shadcn/TailwindCSS Admin |

All custom admin panels use the same PayloadCMS authentication, data layer, and API - only the UI changes.

## 📦 Distribution (Under Consideration)

We are exploring two distribution approaches:

### Option 1: CLI-based (like shadcn)
- Download components directly into your source code
- Maximum customization flexibility
- Manual updates

### Option 2: Package-based
- Install as npm package
- Automatic updates
- Less customization flexibility

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (payload)/           # Original PayloadCMS admin routes
│   └── (shadcn-admin)/      # Custom admin panel routes
├── components/
│   ├── payloadcms/          # Converted PayloadCMS components
│   │   ├── next/            # Next.js integration (views, layouts, templates)
│   │   └── ui/              # Core UI components (elements, fields, forms)
│   └── ui/                  # Base shadcn/ui components
```

## 🔄 Migration Status

All PayloadCMS UI components have been converted from SCSS to TailwindCSS:

| Category | Components | Status |
|----------|------------|--------|
| **Core UI** | Button, Card, Modal, Drawer, Popup, Table, Pagination | ✅ Done |
| **Form Fields** | Array, Blocks, Checkbox, DateTime, Email, Group, Number, Password, Point, RadioGroup, Relationship, RichText, Row, Upload, Select, Slug, Tabs, Text, Textarea | ✅ Done |
| **Graphics** | Icons, PayloadLogo | ✅ Done |
| **Layout** | Nav, NavWrapper, DocumentHeader, DocumentTabs, FormHeader, DefaultTemplate | ✅ Done |
| **Views** | Login, List, Document, Dashboard, NotFound, Unauthorized, Account, API | ✅ Done |

## ⚠️ Current Limitations

- **Plugin Fallback Not Supported** - PayloadCMS plugins that use `@payloadcms/ui` components are not yet supported. These plugins will not render correctly in custom admin panels. Fallback support is planned for future releases.

## 🛠️ Tech Stack
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui, Radix UI
- **Database**: PostgreSQL (via @payloadcms/db-postgres)

## 🚀 Getting Started

### Prerequisites

- Node.js ^18.20.2 or >=20.9.0
- pnpm ^9 or ^10
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd blank-template
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Start development server
```bash
pnpm dev
```

## 📄 License

MIT

## 🤝 Contributing

This project is in early development. Contributions, ideas, and feedback are welcome!
