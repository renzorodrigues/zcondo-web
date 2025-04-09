/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    serverActions: true,
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000',
  },
  // Add port configuration
  server: {
    port: 3000,
  },
}

module.exports = nextConfig 