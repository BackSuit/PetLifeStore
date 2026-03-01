import { useState } from "react"
import { getDistanceDate } from "src/libs/date"
import {
  Avatar,
  Box,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
  Textarea,
  Button,
} from "@chakra-ui/react"
import CommentActions from "./DeleteComment"

export default function CommentBubble({
  user,
  comment,
  deleteComment,
  editComment,
  replyComment,
  depth = 0,
}) {
  const nameTextSize = useBreakpointValue({ base: "sm", md: "md" })
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")

  // Normalize comment data from backend
  const userName =
    comment?.user?.full_name ||
    comment?.user?.username ||
    comment?.user?.name ||
    comment?.name ||
    "Anonymous"
  const userEmail = comment?.user?.email
  const userAvatar = comment?.user?.profile_picture || comment?.user?.image
  const commentContent = comment?.content || comment?.comment
  const commentDate = comment?.created_at || comment?.commented_at
  const commentId = comment?.id || comment?._id
  const isOwner = user?.email === userEmail
  const replies = comment?.replies || []

  const handleEditClick = () => {
    setEditedContent(commentContent)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (editedContent.trim()) {
      editComment(commentId, editedContent)
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedContent("")
  }

  return (
    <VStack align="flex-start" spacing={2} w="full">
      <HStack w="full" justifyContent="space-between">
        <HStack w="full" fontSize="1rem" spacing={3}>
          <Avatar
            src={userAvatar}
            name={userName}
            size={depth > 0 ? "xs" : "sm"}
          />
          <Stack
            spacing={{ base: -1, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Heading
              as="h3"
              size={nameTextSize}
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
            >
              {userName}
            </Heading>
            {commentDate && (
              <Text
                as="span"
                flexFlow
                flexGrow={1}
                wordBreak="keep-all"
                color="gray.600"
                fontSize={depth > 0 ? "sm" : "md"}
              >
                {getDistanceDate(commentDate)}
                {comment?.is_edited && (
                  <Text as="span" ml={2} fontSize="sm" fontStyle="italic">
                    (edited)
                  </Text>
                )}
              </Text>
            )}
          </Stack>
        </HStack>
        <CommentActions
          deleteComment={() => deleteComment(commentId)}
          editComment={handleEditClick}
          replyComment={() => replyComment(comment)}
          isOwner={isOwner}
        />
      </HStack>
      <VStack align="flex-start" w="full" pl={depth > 0 ? 8 : 12}>
        {isEditing ? (
          <VStack w="full" align="flex-end" spacing={2}>
            <Textarea
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              maxLength={500}
              borderRadius={false}
              size="sm"
            />
            <HStack>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                borderRadius={false}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={handleSaveEdit}
                borderRadius={false}
              >
                Save
              </Button>
            </HStack>
          </VStack>
        ) : (
          <Box fontSize={depth > 0 ? "sm" : "md"}>{commentContent}</Box>
        )}
      </VStack>

      {/* Render nested replies */}
      {replies && replies.length > 0 && (
        <VStack
          w="full"
          spacing={4}
          mt={4}
          pl={{ base: 4, md: 8 }}
          borderLeft="3px solid"
          borderColor="blue.100"
          position="relative"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "3px",
            height: "20px",
            bg: "blue.200",
          }}
        >
          {replies.map(reply => (
            <CommentBubble
              key={reply.id || reply._id}
              user={user}
              comment={reply}
              deleteComment={deleteComment}
              editComment={editComment}
              replyComment={replyComment}
              depth={depth + 1}
            />
          ))}
        </VStack>
      )}
    </VStack>
  )
}
