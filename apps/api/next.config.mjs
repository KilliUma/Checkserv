/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Ignorar avisos de módulos opcionais do Prisma
    config.externals = [...(config.externals || []), '@prisma/engines', '@prisma/client/runtime']
    return config
  },
}

export default nextConfig
