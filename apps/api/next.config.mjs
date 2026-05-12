/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurar carregamento de variáveis de ambiente do diretório raiz
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  webpack: (config) => {
    // Ignorar avisos de módulos opcionais do Prisma
    config.externals = [...(config.externals || []), '@prisma/engines', '@prisma/client/runtime']
    return config
  },
}

export default nextConfig
