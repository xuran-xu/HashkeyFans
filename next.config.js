/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:lang/img/:path*',
          destination: '/img/:path*',
        },
        {
          source: '/:lang/content/:path*',
          destination: '/content/:path*',
        }
      ]
    }
  },
  images: {
    domains: ['supra.com'],
    unoptimized: process.env.NODE_ENV === 'development'
  }
}

module.exports = nextConfig 