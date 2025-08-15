import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@haive/ui'], // the package name in packages/ui/package.json
  experimental: { forceSwcTransforms: true },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
    }
    return config
  },
}
export default nextConfig
