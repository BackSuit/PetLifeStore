import { useState } from "react"
import { useSession } from "next-auth/react"
import { Heading, VStack, Text, Divider, Button } from "@chakra-ui/react"
import CommentForm from "./CommentForm"
import CommentBubble from "./CommentBuble"
import { isDevelopment } from "src/constanst/development"
import RenderInView from "@/components/RenderInView"
import { cleanComment } from "src/libs/comments"

// Helper function to recursively add a reply to nested comments
function addReplyToComment(comment, parentId, newReply) {
  const commentId = comment.id || comment._id?.toString()

  if (commentId === parentId) {
    return {
      ...comment,
      replies: [
        ...(comment.replies || []),
        { ...newReply, replies: newReply.replies || [] },
      ],
      reply_count: (comment.reply_count || 0) + 1,
    }
  }

  if (comment.replies && comment.replies.length > 0) {
    return {
      ...comment,
      replies: comment.replies.map(reply =>
        addReplyToComment(reply, parentId, newReply)
      ),
    }
  }

  return comment
}

// Helper function to recursively update a comment at any depth
function updateCommentInTree(comment, commentId, updatedData) {
  const currentId = comment.id || comment._id?.toString()

  if (currentId === commentId) {
    return { ...updatedData, replies: comment.replies }
  }

  if (comment.replies && comment.replies.length > 0) {
    return {
      ...comment,
      replies: comment.replies.map(reply =>
        updateCommentInTree(reply, commentId, updatedData)
      ),
    }
  }

  return comment
}

// Helper function to recursively delete a comment at any depth
function deleteCommentFromTree(comment, commentId) {
  const currentId = comment.id || comment._id?.toString()

  if (currentId === commentId) {
    return null // Mark for deletion
  }

  if (comment.replies && comment.replies.length > 0) {
    return {
      ...comment,
      replies: comment.replies
        .map(reply => deleteCommentFromTree(reply, commentId))
        .filter(reply => reply !== null),
    }
  }

  return comment
}

export default function Comment({ slug, comments, setComments }) {
  const { data: session, status } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const [loading, setLoading] = useState(false)

  console.log("[Comment Component] Session status:", status)
  console.log(
    "[Comment Component] Session data:",
    session
      ? {
          userId: session.userId,
          email: session.user?.email,
          hasToken: !!session.accessToken,
        }
      : null
  )

  function toggleForm() {
    setShowForm(show => !show)
    setReplyTo(null)
  }

  function handleReply(comment) {
    setReplyTo(comment)
    setShowForm(true)
  }

  async function addComment(content, parentId = null) {
    console.log("[Comment] addComment called, session exists:", !!session)
    if (!session) {
      console.error("[Comment] No session available!")
      return
    }
    setLoading(true)

    const commentData = {
      content: cleanComment(content),
      parent_id: parentId || null,
    }

    console.log("[Comment] Submitting comment:", { slug, commentData })

    try {
      const res = await fetch(`/api/post/${slug}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      })

      console.log("[Comment] Response status:", res.status)

      if (!res.ok) {
        const errorData = await res.json()
        console.error("[Comment] Error response:", errorData)
        throw new Error(errorData.error || "Failed to add comment")
      }

      const { data } = await res.json()
      console.log("[Comment] Comment created:", data)

      if (data) {
        if (parentId) {
          // Use recursive helper to add reply at any depth
          setComments(prev =>
            prev.map(comment => addReplyToComment(comment, parentId, data))
          )
        } else {
          // Top-level comment
          setComments(prev => [...prev, { ...data, replies: [] }])
        }
      }
    } catch (error) {
      console.error("[Comment] Failed to add comment:", error)
      if (isDevelopment) console.error(error)
    } finally {
      setShowForm(false)
      setReplyTo(null)
      setLoading(false)
    }
  }

  async function editComment(commentId, newContent) {
    if (!session) return
    setLoading(true)

    console.log("[Comment] Editing comment:", commentId)

    try {
      const res = await fetch(`/api/post/${slug}/${commentId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: cleanComment(newContent) }),
      })

      console.log("[Comment] Edit response status:", res.status)

      if (!res.ok) {
        const errorData = await res.json()
        console.error("[Comment] Edit error:", errorData)
        throw new Error(errorData.error || "Failed to edit comment")
      }

      const { data } = await res.json()
      console.log("[Comment] Comment edited:", data)

      if (data) {
        // Use recursive helper to update comment at any depth
        setComments(allComments =>
          allComments.map(comment =>
            updateCommentInTree(comment, commentId, data)
          )
        )
      }
    } catch (error) {
      console.error("[Comment] Failed to edit comment:", error)
      if (isDevelopment) console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteComment(commentId) {
    if (!session) return
    setLoading(true)

    console.log("[Comment] Deleting comment:", commentId)

    try {
      const res = await fetch(`/api/post/${slug}/${commentId}`, {
        method: "DELETE",
      })

      console.log("[Comment] Delete response status:", res.status)

      if (!res.ok) {
        const errorData = await res.json()
        console.error("[Comment] Delete error:", errorData)
        throw new Error(errorData.error || "Failed to delete comment")
      }

      const { data } = await res.json()
      console.log("[Comment] Comment deleted:", data)

      if (data) {
        // Use recursive helper to delete comment at any depth
        setComments(allComments =>
          allComments
            .map(comment => deleteCommentFromTree(comment, commentId))
            .filter(comment => comment !== null)
        )
      }
    } catch (error) {
      console.error("[Comment] Failed to delete comment:", error)
      if (isDevelopment) console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RenderInView>
      {({ ref, inView }) => (
        <VStack
          alignItems="flex-start"
          spacing={6}
          mt={6}
          py={6}
          w="full"
          ref={ref}
        >
          <Divider color="gray.300" />
          <Heading size="md">
            Recent comments (
            <span>{comments.filter(c => !c.parent_id).length}</span>)
          </Heading>
          {session ? (
            showForm ? (
              <CommentForm
                toggleForm={toggleForm}
                user={session.user}
                addComment={content => addComment(content, replyTo?.id)}
                replyTo={replyTo}
              />
            ) : (
              <Button onClick={toggleForm} variant="link" fontWeight="normal">
                Add comment
              </Button>
            )
          ) : (
            <Text>Login to leave a comment</Text>
          )}
          {inView && (
            <VStack spacing={6} w="full">
              {comments
                .filter(c => !c.parent_id)
                .map((c, idx) => (
                  <CommentBubble
                    deleteComment={deleteComment}
                    editComment={editComment}
                    replyComment={handleReply}
                    isAuthenticated={!!session}
                    key={idx}
                    comment={c}
                    user={session?.user}
                    depth={0}
                  />
                ))}
            </VStack>
          )}
        </VStack>
      )}
    </RenderInView>
  )
}
