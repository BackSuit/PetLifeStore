import Link from "next/link"
import { Flex, Text } from "@chakra-ui/react"
import { CATEGORY_ID_ROUTE } from "src/constanst/routes"

export default function ArticleCategory({ category }) {
  return (
    <Flex d="flex" alignItems="center" mb={3}>
      <Text color="brand.gray" mr="2">
        Category:{" "}
      </Text>
      <Text
        as={Link}
        href={CATEGORY_ID_ROUTE(category?.slug)}
        color="blue.800"
        mr="2"
        py="0.5"
        px="2"
        borderRadius="2px"
        backgroundColor="yellow.200"
        transition="background-color 200ms ease-in-out"
        _hover={{
          backgroundColor: "yellow.300",
        }}
      >
        {category?.name}
      </Text>
    </Flex>
  )
}
