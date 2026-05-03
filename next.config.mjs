import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode catches potential issues early
  reactStrictMode: true,

  // Security headers for government-appropriate deployments
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

// Only wrap with Sentry if DSN is configured
const sentryEnabled = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

export default sentryEnabled
  ? withSentryConfig(nextConfig, {
      // Sentry build options
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    }, {
      // Sentry runtime options
      hideSourceMaps: true,
      disableLogger: true,
    })
  : nextConfig
