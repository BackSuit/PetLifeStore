import { fetchArticle } from "@/libs/api"
import { getArticleComments, createComment } from "@/libs/comments"
import { parse as parseCookie } from "cookie"

const DEV = process.env.NODE_ENV !== "production"

// Helper to get access token from cookies or Authorization header
function getAccessToken(req) {
  // Try Authorization header first
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  // Try cookies
  const cookies = parseCookie(req.headers.cookie || "")
  return cookies.access_token || null
}

export default async function handler(req, res) {
  const {
    query: { slug },
    method,
  } = req

  console.log(`[API /post/${slug}] Method: ${method}`)

  // Validate article exists
  const article = await fetchArticle(slug)
  if (!article) {
    console.log(`[API /post/${slug}] Article not found`)
    return res.status(404).json({ error: "Article not found" })
  }

  console.log(`[API /post/${slug}] Article found:`, article.id)

  switch (method) {
    case "GET":
      try {
        const comments = await getArticleComments(article.id)
        return res.status(200).json({
          data: {
            slug,
            articleId: article.id,
            comments: comments.comments || [],
          },
        })
      } catch (error) {
        if (DEV) console.error(error)
        return res.status(500).json({ error: error.message, data: null })
      }

    case "POST":
      console.log(`[API /post/${slug}] Getting access token...`)
      const accessToken = getAccessToken(req)
      console.log(
        `[API /post/${slug}] Access token:`,
        accessToken ? "present" : "missing"
      )

      if (!accessToken) {
        console.log(`[API /post/${slug}] No access token - unauthorized`)
        return res
          .status(401)
          .json({ error: "Unauthorized - please login", data: null })
      }

      try {
        const { content, parent_id } = req.body
        console.log(`[API /post/${slug}] Comment data:`, {
          content: content?.substring(0, 50),
          parent_id,
        })

        if (!content || content.trim().length === 0) {
          return res.status(400).json({ error: "Comment content is required" })
        }

        console.log(`[API /post/${slug}] Creating comment with backend token`)

        const comment = await createComment(
          article.id,
          content,
          parent_id || null,
          accessToken
        )

        console.log(`[API /post/${slug}] Comment created:`, comment)
        return res.status(200).json({ data: comment })
      } catch (error) {
        console.error(`[API /post/${slug}] Error creating comment:`, error)
        if (DEV) console.error(error)
        return res.status(500).json({ error: error.message })
      }

    default:
      return res
        .status(400)
        .json({ error: `Error: Unhandled method ${method}` })
  }
}
