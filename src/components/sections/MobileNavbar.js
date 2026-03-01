import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  Link,
  UnorderedList,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from "@chakra-ui/react"
import { AiOutlineInstagram } from "react-icons/ai"
import NextLink from "next/link"
import { useRouter } from "next/router"

import { CATEGORY_ID_ROUTE, HOME_ROUTE } from "src/constanst/routes"
import config from "@/contents/site-settings.json"

// Get category info by slug
function getCategoryBySlug(slug) {
  const categories = config.predefined_categories || []
  return categories.find(cat => cat.slug === slug)
}

// Find category by label/name (case-insensitive)
function getCategoryByLabel(label) {
  const categories = config.predefined_categories || []
  if (!label) return null
  const key = String(label).trim().toLowerCase()
  return (
    categories.find(
      cat =>
        String(cat.name || "")
          .trim()
          .toLowerCase() === key
    ) ||
    categories.find(
      cat =>
        String(cat.slug || "")
          .trim()
          .toLowerCase() === key
    )
  )
}

function MobileNavLink({ href, children, onClose }) {
  const router = useRouter()
  const isActive = router.asPath === href

  return (
    <Link
      as={NextLink}
      href={href}
      onClick={onClose}
      display="block"
      py={2}
      px={4}
      fontSize="sm"
      color={isActive ? "brand.primary" : "gray.700"}
      fontWeight={isActive ? 600 : 400}
      _hover={{ bg: "gray.50", color: "brand.primary" }}
    >
      {children}
    </Link>
  )
}

export default function MobileNavbar({ isOpen, onClose }) {
  const navGroups = config.navbar_groups || []
  const siteName = config.site_name || config.site_title

  return (
    <Drawer
      placement="left"
      autoFocus={false}
      onClose={onClose}
      isOpen={isOpen}
      zIndex={12}
    >
      <DrawerOverlay />
      <DrawerContent bg="white">
        <DrawerHeader
          py={4}
          borderBottomWidth="1px"
          borderBottomColor="gray.100"
        >
          <Flex alignItems="center">
            <Heading size="md" fontWeight="600" color="gray.800">
              {siteName}
            </Heading>
          </Flex>
        </DrawerHeader>
        <DrawerBody pt={0} px={0}>
          <VStack
            w="full"
            spacing={0}
            justifyContent="space-between"
            height="full"
          >
            <Box w="full">
              {/* Home link */}
              <Box borderBottom="1px solid" borderColor="gray.100">
                <MobileNavLink href={HOME_ROUTE} onClose={onClose}>
                  Home
                </MobileNavLink>
              </Box>

              {/* Accordion groups (only for groups that have items) */}
              {(() => {
                const itemGroups = navGroups.filter(
                  g => Array.isArray(g.items) && g.items.length > 0
                )
                const plainGroups = navGroups.filter(
                  g => !(Array.isArray(g.items) && g.items.length > 0)
                )

                return (
                  <>
                    <Accordion allowMultiple>
                      {itemGroups.map((group, index) => (
                        <AccordionItem key={index} border="none">
                          <AccordionButton
                            py={3}
                            px={4}
                            _hover={{ bg: "gray.50" }}
                            _expanded={{ bg: "gray.50" }}
                          >
                            <Text
                              flex="1"
                              textAlign="left"
                              fontSize="sm"
                              fontWeight="500"
                              color="gray.700"
                            >
                              {group.label}
                            </Text>
                            <AccordionIcon color="gray.400" />
                          </AccordionButton>
                          <AccordionPanel pb={2} px={0} bg="gray.25">
                            {group.items.map(slug => {
                              const category = getCategoryBySlug(slug)
                              if (!category) return null
                              return (
                                <MobileNavLink
                                  key={slug}
                                  href={CATEGORY_ID_ROUTE(slug)}
                                  onClose={onClose}
                                >
                                  {category.name}
                                </MobileNavLink>
                              )
                            })}
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    {/* Plain groups (no items) rendered as direct links */}
                    {plainGroups.map((group, index) => {
                      const category = group.slug
                        ? getCategoryBySlug(group.slug)
                        : getCategoryByLabel(group.label)
                      const slug = category ? category.slug : group.slug
                      const href = slug ? CATEGORY_ID_ROUTE(slug) : "#"
                      return (
                        <Box
                          key={`plain-${index}`}
                          borderBottom="1px solid"
                          borderColor="gray.100"
                        >
                          <MobileNavLink href={href} onClose={onClose}>
                            {group.label}
                          </MobileNavLink>
                        </Box>
                      )
                    })}
                  </>
                )
              })()}
            </Box>

            <UnorderedList
              alignSelf="flex-end"
              w="full"
              px={6}
              pb={2}
              pt={3}
              color="gray.500"
              display="flex"
              alignItems="center"
              borderTop="1px solid"
              borderTopColor="gray.100"
              fontSize="sm"
            >
              <Icon marginRight={3} boxSize="1.2em" as={AiOutlineInstagram} />
              <Link
                href={`/redirect?url=https://instagram.com/${config.instagram_account}`}
                _hover={{ color: "brand.primary" }}
              >
                @{config.instagram_account}
              </Link>
            </UnorderedList>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
