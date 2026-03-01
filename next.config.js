const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  images: {
    // If NEXT_IMAGE_UNOPTIMIZED=true, Next's image optimizer will be disabled.
    // This helps avoid runtime ETIMEDOUT when remote image hosts are unreachable
    // (useful for local development or flaky remote APIs).
    unoptimized:
      process.env.NEXT_IMAGE_UNOPTIMIZED === "true" ||
      process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Turbopack is enabled by default in Next.js 16+. Provide an empty
  // turbopack config so builds that add a webpack config (via plugins)
  // don't error when Turbopack is the default bundler.
  turbopack: {},
}

module.exports = withPWA(nextConfig)
