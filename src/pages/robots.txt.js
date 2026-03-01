import siteSettings from "@/contents/site-settings.json"

function generateRobotsTxt(baseUrl) {
  return `# *
User-agent: *
Allow: /

# Host
Host: ${baseUrl}

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
`
}

export async function getServerSideProps({ res }) {
  const baseUrl = siteSettings.base_url || "https://prettylong.com"

  const robotsTxt = generateRobotsTxt(baseUrl)

  res.setHeader("Content-Type", "text/plain")
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  )
  res.write(robotsTxt)
  res.end()

  return {
    props: {},
  }
}

// Default export to prevent Next.js errors
export default function RobotsTxt() {
  return null
}
