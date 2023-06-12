/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix:
    process.env.NODE_ENV === 'production'
      ? 'https://laofoundation.netlify.app'
      : undefined,
  reactStrictMode: false,
  swcMinify: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  trailingSlash: true,
  env: { API: process.env.REACT_APP_API_URL },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
