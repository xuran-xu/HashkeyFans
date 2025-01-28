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
  async headers() {
    return [
      {
        source: '/.well-known/walletconnect.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },
  images: {
    domains: ['supra.com'],
    unoptimized: process.env.NODE_ENV === 'development'
  }
}

module.exports = nextConfig 