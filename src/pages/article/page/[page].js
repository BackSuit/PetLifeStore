import Layout from "@/components/layout"
import ArticleList from "@/components/article/ArticleList"
import Meta from "@/components/meta"
import { countArticles, fetchArticles } from "@/libs/api"
import { ARTICLE_PAGE_ROUTE } from "src/constanst/routes"
import config from "@/contents/site-settings.json"

export default function Page({ articles, pagination, page }) {
  const url = ARTICLE_PAGE_ROUTE(page)
  const title = `All posts page ${page}`
  return (
    <Layout>
      <Meta url={url} title={title} />
      <ArticleList
        title={"Articles"}
        articles={articles}
        pagination={pagination}
      />
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const page = parseInt(params.page)
  const postsPerPage = config.posts_per_page || 9
  const articles = (await fetchArticles()).slice(
    (params.page - 1) * postsPerPage,
    params.page * postsPerPage
  )
  const count = await countArticles()
  const pagination = {
    current: page,
    pages: Math.ceil(count / postsPerPage),
  }
  return {
    props: {
      articles,
      pagination,
      page,
    },
  }
}

export async function getStaticPaths() {
  const postsPerPage = config.posts_per_page || 9
  const count = await countArticles()
  const pages = Math.ceil(count / postsPerPage)
  const paths = Array.from(Array(pages - 1).keys()).map(it => ({
    params: { page: (it + 2).toString() },
  }))
  return {
    paths: paths,
    fallback: false,
  }
}
