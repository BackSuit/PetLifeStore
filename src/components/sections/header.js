import {
  Box,
  Flex,
  Icon,
  useDisclosure,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  HStack,
} from "@chakra-ui/react"
import { HiX as CloseIcon, HiMenu as MenuIcon, HiSearch } from "react-icons/hi"
import { useRouter } from "next/router"
import { useState } from "react"
import Logo from "./Logo"
import MobileNavbar from "./MobileNavbar"
import NavDropdown from "./NavDropdown"
import AuthButton from "../auth/AuthButton"

function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = e => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/article?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <Box
      as="form"
      onSubmit={handleSearch}
      display={{ base: "none", lg: "block" }}
    >
      <InputGroup size="sm" w="200px">
        <InputLeftElement pointerEvents="none">
          <Icon as={HiSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          bg="white"
          borderColor="gray.200"
          borderRadius="full"
          fontSize="sm"
          _placeholder={{ color: "gray.400" }}
          _focus={{
            borderColor: "brand.primary",
            boxShadow: "0 0 0 1px #8B4513",
          }}
        />
      </InputGroup>
    </Box>
  )
}

// Editor's Picks CTA removed per request

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex
      as="nav"
      alignItems="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mx="auto"
      py={{ base: 3, lg: 4 }}
      px={{ base: 4, md: 8, lg: 12 }}
      bgColor="rgba(253, 251, 247, 0.95)"
      color="gray.800"
      className="header"
      pos="fixed"
      top={0}
      left={0}
      right={0}
      zIndex="10"
      borderBottom="1px solid"
      borderBottomColor="gray.100"
      sx={{
        "@supports (backdrop-filter: saturate(180%) blur(20px))": {
          backdropFilter: "saturate(180%) blur(20px)",
          bgColor: "rgba(253, 251, 247, 0.85)",
        },
        "@supports (-webkit-backdrop-filter: saturate(180%) blur(20px))": {
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          bgColor: "rgba(253, 251, 247, 0.85)",
        },
      }}
      id="header-nav"
    >
      {/* Left section: Hamburger + Logo */}
      <HStack spacing={3}>
        <IconButton
          aria-label="Hamburger menu"
          display={{ base: "flex", md: "none" }}
          variant="ghost"
          onClick={onOpen}
          size="sm"
          icon={<Icon boxSize="1.25em" as={isOpen ? CloseIcon : MenuIcon} />}
        />
        <Logo size="md" />
      </HStack>

      <MobileNavbar isOpen={isOpen} onClose={onClose} />

      {/* Center section: Navigation with dropdowns */}
      <NavDropdown />

      {/* Right section: Search + CTA + Auth */}
      <HStack spacing={3} display={{ base: "none", md: "flex" }}>
        <SearchBar />
        <AuthButton />
      </HStack>

      {/* Mobile Auth */}
      <Box display={{ base: "block", md: "none" }}>
        <AuthButton />
      </Box>
    </Flex>
  )
}
