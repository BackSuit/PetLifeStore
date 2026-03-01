import { deleteComment, updateComment } from "@/libs/comments"
import { parse as parseCookie } from "cookie"

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
    query: { commentId, slug },
    method,
  } = req

  console.log(`[API /post/${slug}/${commentId}] Method: ${method}`)

  const accessToken = getAccessToken(req)
  console.log(
    `[API /post/${slug}/${commentId}] Access token:`,
    accessToken ? "present" : "missing"
  )

  if (!accessToken) {
    console.log(
      `[API /post/${slug}/${commentId}] No access token - unauthorized`
    )
    return res.status(401).json({ error: "Unauthenticated" }).end()
  }

  switch (method) {
    case "PUT":
      try {
        const { content } = req.body
        if (!content) {
          return res.status(400).json({ error: "Content is required" })
        }

        console.log(`[API /post/${slug}/${commentId}] Updating comment...`)
        const updatedComment = await updateComment(
          commentId,
          content,
          accessToken
        )
        console.log(
          `[API /post/${slug}/${commentId}] Comment updated successfully`
        )
        return res.status(200).json({ data: updatedComment, error: null })
      } catch (error) {
        console.error(`[API /post/${slug}/${commentId}] Error:`, error)
        if (error.message.includes("only edit your own")) {
          return res.status(403).json({ error: error.message })
        }
        return res.status(400).json({ error: error.message || "Server Error" })
      }

    case "DELETE":
      try {
        console.log(`[API /post/${slug}/${commentId}] Deleting comment...`)
        await deleteComment(commentId, accessToken)
        console.log(
          `[API /post/${slug}/${commentId}] Comment deleted successfully`
        )
        return res.status(200).json({ data: true, error: null })
      } catch (error) {
        console.error(`[API /post/${slug}/${commentId}] Error:`, error)
        if (error.message.includes("only delete your own")) {
          return res.status(403).json({ error: error.message })
        }
        return res.status(400).json({ error: error.message || "Server Error" })
      }

    default:
      return res
        .status(400)
        .json({ error: `Error: Unhandled method ${method}` })
  }
}
