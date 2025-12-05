import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Add aliases for local PayloadCMS packages (shadcn-admin only)
    // Only @payloadcms-local/* aliases - does NOT override @payloadcms/ui
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      // Local package aliases (for direct imports in shadcn-admin)
      '@payloadcms-local/next/layouts': path.resolve(
        __dirname,
        'src/components/payloadcms/next/src/exports/layouts.ts',
      ),
      '@payloadcms-local/next/views': path.resolve(
        __dirname,
        'src/components/payloadcms/next/src/exports/views.ts',
      ),
      '@payloadcms-local/next/routes': path.resolve(
        __dirname,
        'src/components/payloadcms/next/src/exports/routes.ts',
      ),
      '@payloadcms-local/next/templates': path.resolve(
        __dirname,
        'src/components/payloadcms/next/src/exports/templates.ts',
      ),
      '@payloadcms-local/next/utilities': path.resolve(
        __dirname,
        'src/components/payloadcms/next/src/exports/utilities.ts',
      ),
      '@payloadcms-local/next/client': path.resolve(
        __dirname,
        'src/components/payloadcms/next/src/exports/client.ts',
      ),
      '@payloadcms-local/next/rsc': path.resolve(
        __dirname,
        'src/components/payloadcms/next/src/exports/rsc.ts',
      ),
      '@payloadcms-local/next/auth': path.resolve(
        __dirname,
        'src/components/payloadcms/next/src/exports/auth.ts',
      ),
      '@payloadcms-local/next': path.resolve(
        __dirname,
        'src/components/payloadcms/next/src/index.js',
      ),
      '@payloadcms-local/ui/shared': path.resolve(
        __dirname,
        'src/components/payloadcms/ui/src/exports/shared/index.ts',
      ),
      '@payloadcms-local/ui/rsc': path.resolve(
        __dirname,
        'src/components/payloadcms/ui/src/exports/rsc/index.ts',
      ),
      '@payloadcms-local/ui/utilities/getClientConfig': path.resolve(
        __dirname,
        'src/components/payloadcms/ui/src/utilities/getClientConfig.ts',
      ),
      '@payloadcms-local/ui/elements/RenderServerComponent': path.resolve(
        __dirname,
        'src/components/payloadcms/ui/src/elements/RenderServerComponent/index.tsx',
      ),
      '@payloadcms-local/ui': path.resolve(
        __dirname,
        'src/components/payloadcms/ui/src/exports/client/index.ts',
      ),
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
