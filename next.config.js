/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Only use rewrites in development or when API_URL is not set
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl || process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: process.env.BACKEND_URL || 'http://localhost:3001/api/:path*',
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;

