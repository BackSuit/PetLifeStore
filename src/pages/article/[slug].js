import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import readingTime from "reading-time"
import { useInView } from "react-intersection-observer"

// Components
import ArticleAuthor from "@/components/article/ArticleAuthor"
import ArticleBody from "@/components/article/ArticleBody"
import ArticleCategory from "@/components/article/ArticleCategory"
import ArticleCoverImage from "@/components/article/ArticleCoverImage"
import ArticleLayout from "@/components/article/ArticleLayout"
import ArticleTitle from "@/components/article/ArticleTitle"
import Layout from "@/components/layout"
import ArticleShare from "@/components/article/ArticleShare"
import Meta from "@/components/meta"
const Comment = dynamic(() => import("@/components/comment"))

// Library Components
import { Avatar, Icon, Stack, Text } from "@chakra-ui/react"
import { FiUser } from "react-icons/fi"

// Libs
import ArticleMeta from "@/components/meta/ArticleMeta"
import config from "@/contents/site-settings.json"
import { fetchArticle, fetchArticleSlugs } from "@/libs/api"
import markdownToHtml from "@/libs/markdownToHTML"
import { formatDate } from "@/libs/date"
import { ARTICLE_ID_ROUTE } from "src/constanst/routes"

export default function Article({ article }) {
  const [comments, setComments] = useState([])
  const { title, slug, excerpt, date, category, authors, image_url, content } =
    article

  const { ref, inView } = useInView({
    rootMargin: "50px 0px",
    triggerOnce: true,
  })

  // Build nested comment tree from flat list
  const buildCommentTree = comments => {
    if (!Array.isArray(comments)) return []

    // Create a map of comments by ID for quick lookup
    const commentMap = new Map()
    const rootComments = []

    // First pass: create all comment objects with empty replies arrays
    comments.forEach(comment => {
      commentMap.set(comment.id || comment._id?.toString(), {
        ...comment,
        replies: [],
      })
    })

    // Second pass: build the tree structure
    comments.forEach(comment => {
      const commentId = comment.id || comment._id?.toString()
      const commentObj = commentMap.get(commentId)

      if (comment.parent_id) {
        // This is a reply, add it to its parent's replies array
        const parent = commentMap.get(comment.parent_id.toString())
        if (parent) {
          parent.replies.push(commentObj)
          parent.reply_count = (parent.reply_count || 0) + 1
        } else {
          // Parent not found, treat as root comment
          rootComments.push(commentObj)
        }
      } else {
        // This is a root comment
        rootComments.push(commentObj)
      }
    })

    return rootComments
  }

  useEffect(() => {
    if (slug && inView) {
      fetch(`/api/post/${slug}`)
        .then(res => res.json())
        .then(data => {
          console.log("[Article Page] Raw comments from backend:", data)
          if (data && data.data && data.data.comments) {
            // Check if comments are already nested or flat
            const comments = data.data.comments

            // If the backend returns nested structure, keep it
            // Otherwise, build the tree from flat list
            const hasNestedReplies = comments.some(
              c => c.replies && Array.isArray(c.replies) && c.replies.length > 0
            )

            let processedComments
            if (hasNestedReplies) {
              // Backend returns nested structure, use it
              console.log("[Article Page] Backend returned nested structure")
              processedComments = comments
            } else {
              // Backend returns flat list, build tree
              console.log(
                "[Article Page] Backend returned flat list, building tree"
              )
              processedComments = buildCommentTree(comments)
            }

            console.log("[Article Page] Processed comments:", processedComments)
            setComments(processedComments)
          }
        })
    }
  }, [slug, inView])

  const fullUrl = `${config.base_url}${ARTICLE_ID_ROUTE(slug)}`
  const readTime = content && readingTime(content)
  const datePublised = new Date(date)
  const authorsMeta = authors.reduce((all, author, index) => {
    let sep = index < authors.length - 1
    return all + author.name + (sep ? ", " : "")
  }, "")

  return (
    <Layout>
      <Meta
        url={ARTICLE_ID_ROUTE(slug)}
        title={title}
        keywords={category?.name}
        description={excerpt}
        date={datePublised}
        author={authorsMeta}
        image={image_url}
      />
      <ArticleMeta
        title={title}
        description={excerpt}
        author={authorsMeta}
        keywords={category?.name}
        date={datePublised}
        image={image_url}
        url={ARTICLE_ID_ROUTE(slug)}
      />

      <ArticleLayout>
        <meta itemProp="datePublished" content={datePublised} />
        <meta itemProp="image" content={image_url} />
        <meta
          itemProp="publisher"
          content={config.site_name || config.site_title}
        />
        <section itemProp="articleBody">
          <header>
            {category && <ArticleCategory category={category} />}
            <ArticleTitle slug={slug} title={title} />
            <Stack
              direction="row"
              flexWrap="wrap"
              spacing={{ base: 1, md: 2 }}
              my="4"
              color="gray.600"
            >
              <Avatar
                size="xs"
                bgColor="gray.200"
                icon={<Icon as={FiUser} />}
              />
              {authors && <ArticleAuthor authors={authors} />}
              {date && (
                <Text as="span" color="brand.gray">
                  {formatDate(datePublised)}
                </Text>
              )}
              <Text as="span" color="brand.gray">
                ·
              </Text>
              <Text as="span" color="brand.gray">
                {readTime?.text}
              </Text>
            </Stack>
            <ArticleCoverImage featuredImage={image_url} alt={title} />
          </header>
          <ArticleBody body={content} />
          <ArticleShare url={fullUrl} />
          <div ref={ref}>
            {inView && (
              <Comment
                comments={comments}
                setComments={setComments}
                slug={slug}
              />
            )}
          </div>
        </section>
      </ArticleLayout>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const article = await fetchArticle(params.slug)

  if (!article) {
    return {
      notFound: true,
    }
  }

  const content = await markdownToHtml(article.content || "")
  return {
    props: {
      article: {
        ...article,
        content,
      },
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}

export async function getStaticPaths() {
  try {
    const paths = await fetchArticleSlugs()
    return {
      paths: paths.map(path => ({
        params: { slug: path.slug },
      })),
      fallback: "blocking", // Use blocking fallback for better UX
    }
  } catch (error) {
    console.error("Error fetching article paths:", error)
    return {
      paths: [],
      fallback: "blocking",
    }
  }
}
