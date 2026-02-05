import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Edge redirects - instant, no serverless cold start
  async redirects() {
    return [
      // Uncomment and customize as needed:
      // {
      //   source: '/',
      //   destination: '/dashboard',
      //   permanent: false,
      // },
    ]
  },

  // Recommended settings
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
