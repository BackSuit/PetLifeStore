const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  images: {
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
    // Removed 4K/rare sizes to prevent "Transformation Spikes"
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    // Set to 1 year (31,536,000 seconds) to save your quota
    minimumCacheTTL: 31536000, 
    dangerouslyAllowSVG: true,
    // Changed to "inline" so images open in the browser instead of downloading
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  turbopack: {},
}

module.exports = withPWA(nextConfig)
