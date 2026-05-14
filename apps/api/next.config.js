/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@wearcheck/auth', '@wearcheck/database', '@wearcheck/pdf', '@wearcheck/types'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      '@prisma/engines',
      '@prisma/client/runtime',
      'pdfkit',
    ]
    return config
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
