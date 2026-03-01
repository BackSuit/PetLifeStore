import siteSettings from "@/contents/site-settings.json"

function generateManifest(config) {
  return {
    name: config.site_name || "Pretty Long",
    short_name: config.site_title || "Pretty Long",
    description:
      config.site_description ||
      "A Media News company sharing stories at the intersection of entertainment, education and lifestyle.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/meta/maskable_icon_x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/meta/maskable_icon_x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    orientation: "portrait",
  }
}

export async function getServerSideProps({ res }) {
  const manifest = generateManifest(siteSettings)

  res.setHeader("Content-Type", "application/json")
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  )
  res.write(JSON.stringify(manifest, null, 2))
  res.end()

  return {
    props: {},
  }
}

// Default export to prevent Next.js errors
export default function Manifest() {
  return null
}
