import { Box, Grid, Heading, VStack } from "@chakra-ui/react"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import RenderInView from "@/components/RenderInView"
import Person from "@/components/team/person"

export default function HomeTeam({ managerialTeams }) {
  return (
    <RenderInView>
      {({ ref, inView }) => (
        <VStack ref={ref} px="8" py="10" mt="5vh" pos="relative">
          <Heading as="h2" size="lg" textAlign="center">
            Meet the Team
          </Heading>
          {inView && (
            <Grid
              templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
              gap={{ base: 2, xl: 8 }}
              width={{ base: "100%", md: "65%", lg: "50%" }}
              py={5}
              overflowX="hidden"
            >
              {managerialTeams.map((m, i) => {
                // Build social media from social_links array
                const socialMedia = []

                // Add all social links from the API
                if (m.social_links && m.social_links.length > 0) {
                  m.social_links.forEach(link => {
                    if (link.platform && (link.url || link.handle)) {
                      socialMedia.push({
                        platform: link.platform,
                        identifier: link.handle || link.url,
                        url: link.url,
                      })
                    }
                  })
                }

                // Always add email if it exists
                if (m.email) {
                  socialMedia.push({
                    platform: "mail",
                    identifier: m.email,
                  })
                }

                const person = {
                  name: m.name,
                  role: m.role,
                  social_media: socialMedia,
                  photo: m.profile_picture,
                  id: m.id,
                }
                return <Person person={person} key={person.id} />
              })}
            </Grid>
          )}
          <PrimaryButton
            bgColor="black"
            colorScheme="black"
            href="/meet-the-team"
          >
            Full Team
          </PrimaryButton>
          <Box
            pos="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bgColor="gray.50"
            zIndex="-10"
          />
        </VStack>
      )}
    </RenderInView>
  )
}
