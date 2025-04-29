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
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable standalone output mode for Vercel deployment
  output: undefined,
  // Add transpilePackages to ensure all dependencies are properly transpiled
  transpilePackages: ['react-icons'],
};

module.exports = nextConfig; 