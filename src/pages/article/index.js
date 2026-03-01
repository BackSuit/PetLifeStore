import config from "@/contents/site-settings.json"
import Layout from "@/components/layout"
import ArticleList from "@/components/article/ArticleList"
import Meta from "@/components/meta"
import { countArticles, fetchArticles, searchArticles } from "@/libs/api"
import { ARTICLE_ROUTE } from "src/constanst/routes"

export default function ArticlesPage({ articles, pagination, searchQuery }) {
  const url = ARTICLE_ROUTE
  const title = searchQuery ? `Search Results for "${searchQuery}"` : "Articles"
  const siteName = config.site_name || config.site_title

  return (
    <Layout>
      <Meta
        url={url}
        title={title}
        keywords={[
          "article",
          siteName.toLowerCase(),
          `${siteName.toLowerCase()} articles`,
        ]}
        description={`All articles from ${siteName}`}
      />
      <ArticleList title={title} articles={articles} pagination={pagination} />
    </Layout>
  )
}

export async function getServerSideProps({ query }) {
  const searchQuery = query.search || query.q || ""
  const page = parseInt(query.page) || 1
  const perPage = config.posts_per_page || 9

  let articles = []
  let totalCount = 0

  if (searchQuery) {
    // Use search API when search query is present
    const searchResults = await searchArticles({
      q: searchQuery,
      page: page,
      limit: perPage,
      status: "published",
    })
    articles = searchResults.articles || []
    totalCount = searchResults.total || 0
  } else {
    // Use regular article fetch when no search query
    const offset = (page - 1) * perPage
    articles =
      (await fetchArticles({
        limit: perPage,
        offset: offset,
      })) || []
    totalCount = await countArticles()
  }

  const pagination = {
    current: page,
    pages: Math.ceil(totalCount / perPage),
  }

  return {
    props: {
      articles,
      pagination,
      searchQuery,
    },
  }
}
