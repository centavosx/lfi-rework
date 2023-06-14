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
  env: {
    API: process.env.REACT_APP_API_URL,

    FB_API_KEY: process.env.REACT_APP_FB_API_KEY,
    FB_AUTH_DOMAIN: process.env.REACT_APP_FB_AUTH_DOMAIN,
    FB_PROJECT_ID: process.env.REACT_APP_FB_PROJECT_ID,
    FB_STORAGE_BUCKET: process.env.REACT_APP_FB_STORAGE_BUCKET,
    FB_MESSAGING_ID: process.env.REACT_APP_FB_MESSAGING_ID,
    FB_APP_ID: process.env.REACT_APP_FB_APP_ID,
    FB_DATABASE_URL: process.env.REACT_APP_FB_DB_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
