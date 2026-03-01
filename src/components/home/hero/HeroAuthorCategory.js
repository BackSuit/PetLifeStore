import Link from "next/link"
import { Flex, Text } from "@chakra-ui/react"
import { AUTHOR_ID_ROUTE, CATEGORY_ID_ROUTE } from "src/constanst/routes"

export default function HeroAuthorCategory({
  authors,
  category,
  textSize,
  ...rest
}) {
  return (
    <Flex mb="1.2" d="flex" alignItems="center" color="brand.gray" {...rest}>
      {authors &&
        authors.map((author, index) => (
          <Text
            as={Link}
            href={AUTHOR_ID_ROUTE(author?.slug)}
            key={author._id}
            px={1}
            display="inline-flex"
            overflowY="hidden"
            fontSize={textSize}
          >
            {author?.name}
            {authors.length > 1 && index < authors.length - 1 && ", "}
          </Text>
        ))}
      <Text w={10} mx={1} h={0.4} bgColor="gray.400" />
      <Text
        as={Link}
        href={CATEGORY_ID_ROUTE(category?.slug)}
        px={1}
        d="inline-flex"
        overflowY="hidden"
        fontSize={textSize}
      >
        {category?.name}
      </Text>
    </Flex>
  )
}
