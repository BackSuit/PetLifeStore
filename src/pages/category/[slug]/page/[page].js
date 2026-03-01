import Layout from "@/components/layout"
import ArticleList from "@/components/article/ArticleList"
import Meta from "@/components/meta"
import { fetchByCategory, fetchCategorySlug } from "@/libs/api"
import { CATEGORY_ID_ROUTE } from "src/constanst/routes"
import config from "@/contents/site-settings.json"

export default function CategoryPage({ articles, category, pagination, page }) {
  const url = CATEGORY_ID_ROUTE(category.slug)
  const title = `${category.name} - Page ${page}`

  return (
    <Layout>
      <Meta title={title} url={url} />
      <ArticleList
        articles={articles}
        title="Category:"
        subtitle={category.name}
        url={category.slug}
        pagination={pagination}
      />
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const page = parseInt(params.page)
  const postsPerPage = config.posts_per_page || 9
  const { articles, category } = await fetchByCategory(params.slug)

  // If category doesn't exist, return 404
  if (!category) {
    return {
      notFound: true,
    }
  }

  // Paginate articles
  const paginatedArticles = articles.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  )

  const totalArticles = articles.length

  const pagination = {
    current: page,
    pages: Math.ceil(totalArticles / postsPerPage),
  }

  return {
    props: {
      articles: paginatedArticles || [],
      category: {
        name: category.name || params.slug,
        slug: category.slug || params.slug,
      },
      pagination,
      page,
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  try {
    const postsPerPage = config.posts_per_page || 9
    const categories = await fetchCategorySlug()
    const paths = []

    // For each category, create pagination paths
    for (const category of categories) {
      const { articles } = await fetchByCategory(category.slug)
      const totalArticles = articles.length
      const pages = Math.ceil(totalArticles / postsPerPage)

      // Generate paths for pages 2 onwards (page 1 is handled by [slug].js)
      for (let i = 2; i <= pages; i++) {
        paths.push({
          params: {
            slug: category.slug,
            page: i.toString(),
          },
        })
      }
    }

    return {
      paths,
      fallback: "blocking",
    }
  } catch (error) {
    console.error("Error generating category pagination paths:", error)
    return {
      paths: [],
      fallback: "blocking",
    }
  }
}
