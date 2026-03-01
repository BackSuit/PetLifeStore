import { generatePagination } from "src/libs/pagination"
import { Button, ListItem, Text, UnorderedList } from "@chakra-ui/react"
import Link from "next/link"

export default function Pagination({ current, pages, link }) {
  const pagination = generatePagination(current, pages)
  return (
    <UnorderedList
      listStyleType="none"
      display="flex"
      justifyContent="center"
      marginLeft="0"
    >
      {pagination.map((it, i) => (
        <ListItem
          display="inline-block"
          mr="2"
          fontSize="1.25rem"
          key={i}
          cursor="pointer"
        >
          {it.excerpt ? (
            "..."
          ) : (
            <Text
              color={it.page === current ? "black" : "gray.300"}
              _hover={{
                color: it.page === current ? "black" : "gray.700",
              }}
            >
              <Button
                as={Link}
                href={link.as(it.page)}
                bgColor={it.page === current ? "gray.100" : "white"}
                _hover={{
                  bgColor: it.page === current ? "gray.200" : "gray.200",
                }}
                borderRadius="none"
              >
                {it.page}
              </Button>
            </Text>
          )}
        </ListItem>
      ))}
    </UnorderedList>
  )
}
