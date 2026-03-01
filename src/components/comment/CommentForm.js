import {
  Button,
  HStack,
  Box,
  Avatar,
  VStack,
  Textarea,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react"
import { useState } from "react"

export default function CommentForm({ user, addComment, toggleForm, replyTo }) {
  const [input, setInput] = useState("")
  const submitButtonSize = useBreakpointValue({ base: "sm", md: "md" })

  const placeholder = replyTo
    ? `Replying to ${
        replyTo.user?.full_name || replyTo.user?.username || "user"
      }...`
    : `Commenting as ${user.name}`

  return (
    <VStack w="full" spacing={2} align="flex-start">
      {replyTo && (
        <Text fontSize="sm" color="gray.600" pl={12}>
          Replying to{" "}
          <strong>{replyTo.user?.full_name || replyTo.user?.username}</strong>
        </Text>
      )}
      <HStack w="full" alignItems="flex-start" spacing={3}>
        <Box>
          <Avatar size="sm" src={user.image} />
        </Box>
        <VStack
          w="full"
          align="flex-end"
          as="form"
          onSubmit={e => {
            e.preventDefault()
            if (input.trim()) {
              addComment(input, replyTo?.id)
              setInput("")
            }
          }}
        >
          <Textarea
            placeholder={placeholder}
            size="md"
            type="text"
            name="comment"
            maxLength={500}
            borderRadius={false}
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus={!!replyTo}
          />
          <HStack justifyContent="flex-end">
            <Button
              variant="ghost"
              borderRadius={false}
              onClick={toggleForm}
              colorScheme="red"
              size={submitButtonSize}
            >
              Cancel
            </Button>
            <Button
              borderRadius={false}
              size={submitButtonSize}
              colorScheme="blue"
              type="submit"
              isDisabled={!input.trim()}
            >
              {replyTo ? "Reply" : "Submit"}
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  )
}
