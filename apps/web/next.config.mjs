/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@wearcheck/ui', '@wearcheck/types'],
  images: {
    domains: ['localhost'],
  },
}

export default nextConfig
