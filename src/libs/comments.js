import Filter from "bad-words"
import wash from "washyourmouthoutwithsoap"
import { getAPIURL, getHeaders } from "./api"

export function cleanComment(comment) {
  const filter = new Filter({ placeHolder: "*" })
  filter.addWords(...wash.words("id"), ...wash.words("en"))
  return filter.clean(comment)
}

// Get comments for an article
export async function getArticleComments(articleId, options = {}) {
  const { limit = 100, offset = 0 } = options
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  })

  const response = await fetch(
    getAPIURL(`/api/v1/comments/article/${articleId}?${queryParams}`),
    {
      method: "GET",
      headers: getHeaders(),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch comments")
  }

  const data = await response.json()
  return data
}

// Create a new comment
export async function createComment(
  articleId,
  content,
  parentId = null,
  token
) {
  const cleanedContent = cleanComment(content)

  const response = await fetch(getAPIURL("/api/v1/comments/"), {
    method: "POST",
    headers: getHeaders(true, token),
    body: JSON.stringify({
      article_id: articleId,
      content: cleanedContent,
      parent_id: parentId,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create comment")
  }

  const data = await response.json()
  return data.comment
}

// Update a comment
export async function updateComment(commentId, content, token) {
  const cleanedContent = cleanComment(content)

  const response = await fetch(getAPIURL(`/api/v1/comments/${commentId}`), {
    method: "PUT",
    headers: getHeaders(true, token),
    body: JSON.stringify({
      content: cleanedContent,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update comment")
  }

  const data = await response.json()
  return data.comment
}

// Delete a comment
export async function deleteComment(commentId, token) {
  const response = await fetch(getAPIURL(`/api/v1/comments/${commentId}`), {
    method: "DELETE",
    headers: getHeaders(true, token),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete comment")
  }

  const data = await response.json()
  return data
}
