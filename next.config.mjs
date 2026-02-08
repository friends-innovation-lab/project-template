/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode for catching bugs
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // Experimental features (uncomment as needed)
  // experimental: {
  //   typedRoutes: true,
  // },
}

export default nextConfig
