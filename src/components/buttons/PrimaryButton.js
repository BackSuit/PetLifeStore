import { Button } from "@chakra-ui/react"
import Link from "next/link"

export default function PrimaryButton({
  children,
  href = "/",
  rightIcon,
  ...rest
}) {
  return (
    <Button
      as={Link}
      href={href}
      py={{ base: 5, md: 6, lg: 7 }}
      px={{ base: 10, md: 14, lg: 20 }}
      lineHeight="1"
      size="lg"
      fontWeight="normal"
      borderRadius="none"
      _hover={{
        opacity: 0.9,
      }}
      _active={{
        opacity: 0.8,
      }}
      rightIcon={rightIcon && rightIcon}
      cursor="pointer"
      {...rest}
    >
      {children.trim()}
    </Button>
  )
}
