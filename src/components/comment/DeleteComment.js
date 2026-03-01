import {
  IconButton,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react"
import {
  HiDotsVertical,
  HiOutlineTrash,
  HiPencil,
  HiReply,
} from "react-icons/hi"

export default function CommentActions({
  deleteComment,
  editComment,
  replyComment,
  isOwner,
}) {
  return (
    <Menu placement="bottom-end">
      <MenuButton>
        <Icon
          color="brand.gray"
          _hover={{ color: "black" }}
          as={HiDotsVertical}
        />
      </MenuButton>
      <MenuList borderRadius={false} borderColor="gray.200" minW="150px">
        <MenuItem
          minH="40px"
          _hover={{ color: "blue.500", bgColor: "blue.50" }}
          onClick={replyComment}
        >
          <Icon mr={2} as={HiReply} />
          <span>Reply</span>
        </MenuItem>
        {isOwner && (
          <>
            <MenuItem
              minH="40px"
              _hover={{ color: "orange.500", bgColor: "orange.50" }}
              onClick={editComment}
            >
              <Icon mr={2} as={HiPencil} />
              <span>Edit</span>
            </MenuItem>
            <MenuItem
              minH="40px"
              _hover={{ color: "red.500", bgColor: "red.50" }}
              onClick={deleteComment}
            >
              <Icon mr={2} as={HiOutlineTrash} />
              <span>Delete</span>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  )
}
