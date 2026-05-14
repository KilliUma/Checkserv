/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@wearcheck/auth', '@wearcheck/database', '@wearcheck/pdf', '@wearcheck/types'],
  webpack: (config) => {
    // Ignorar avisos de módulos opcionais do Prisma
    config.externals = [
      ...(config.externals || []),
      '@prisma/engines',
      '@prisma/client/runtime',
      'pdfkit',
    ]
    return config
  },
}

export default nextConfig
