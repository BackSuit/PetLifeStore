import { fetchArticles } from "@/libs/api"
import { fetchCategories } from "@/libs/api"
import siteSettings from "@/contents/site-settings.json"

function generateSiteMap(articles, categories, baseUrl) {
  const currentDate = new Date().toISOString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <priority>1.00</priority>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
  </url>
  
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/meet-the-team</loc>
    <priority>0.7</priority>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/about-us</loc>
    <priority>0.7</priority>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <priority>0.5</priority>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/terms-of-service</loc>
    <priority>0.5</priority>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
  </url>
  
  <!-- Dynamic Categories -->
  ${categories
    .map(
      category => `  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <priority>0.7</priority>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
  </url>`
    )
    .join("\n")}
  
  <!-- Dynamic Articles -->
  ${articles
    .map(article => {
      const articleDate = article.date || article.published_at || currentDate
      return `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <priority>0.9</priority>
    <lastmod>${new Date(articleDate).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`
    })
    .join("\n")}
</urlset>`
}

export async function getServerSideProps({ res }) {
  const baseUrl = siteSettings.base_url || "https://prettylong.com"

  try {
    // Fetch all published articles from API
    const articles = await fetchArticles({
      status: "published",
      limit: 1000, // Get all articles
      sort: "date",
      order: "desc",
    })

    // Fetch categories (from API or predefined based on use_api_categories setting)
    const categories = await fetchCategories()

    // Generate the XML sitemap
    const sitemap = generateSiteMap(articles, categories, baseUrl)

    res.setHeader("Content-Type", "text/xml")
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    )
    res.write(sitemap)
    res.end()

    return {
      props: {},
    }
  } catch (error) {
    console.error("Error generating sitemap:", error)

    // Fallback to basic sitemap if API fails
    const basicSitemap = generateSiteMap([], [], baseUrl)
    res.setHeader("Content-Type", "text/xml")
    res.write(basicSitemap)
    res.end()

    return {
      props: {},
    }
  }
}

// Default export to prevent Next.js errors
export default function Sitemap() {
  return null
}
