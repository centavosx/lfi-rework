/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: undefined,
  reactStrictMode: false,
  swcMinify: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  trailingSlash: true,
  env: { API: process.env.REACT_APP_API_URL },
}

module.exports = nextConfig

//  process.env.NODE_ENV === 'production'
// ? 'https://manila-feline.netlify.app'
// :
