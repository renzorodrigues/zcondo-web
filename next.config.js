/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.zcondo.com.br',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/images/**',
      }
    ],
    unoptimized: true
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'zcondo-web.vercel.app'],
    },
  },
  output: 'standalone',
};

module.exports = nextConfig; 