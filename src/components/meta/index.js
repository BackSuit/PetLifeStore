import Head from "next/head"
import config from "@/contents/site-settings.json"

export default function Meta({ title, description, keywords, url, image }) {
  // Use site_name for browser title, fallback to site_title
  const siteName = config.site_name || config.site_title

  // SEO meta title: use custom if provided, otherwise use seo_meta_title, otherwise generate from page title
  const metaTitle =
    config.seo_meta_title || (title ? [title, siteName].join(" | ") : siteName)
  const pageTitle = title ? [title, siteName].join(" | ") : siteName

  // SEO meta description: use custom if provided, otherwise use seo_meta_description, otherwise use site_description
  const metaDescription =
    description || config.seo_meta_description || config.site_description

  // SEO meta keywords: use custom if provided, otherwise use seo_meta_keywords, otherwise use site_keywords
  const metaKeywords =
    keywords ||
    config.seo_meta_keywords ||
    config.site_keywords.map(it => it.keyword).join(",")

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      <link rel="canonical" href={config.base_url + url} />

      {/* Open Graph Meta */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={config.base_url + url} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image ?? config.seo_image} />
      <meta property="og:type" content="article" />

      {/* Twitter Card */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content={config.twitter_account} />
      <meta property="twitter:url" content={config.base_url + url} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
    </Head>
  )
}
