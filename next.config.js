/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'zcondo-web.vercel.app'],
    },
  },
};

module.exports = nextConfig; 