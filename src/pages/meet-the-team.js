import { Box, Heading, SimpleGrid } from "@chakra-ui/react"
import Meta from "@/components/meta"
import Layout from "@/components/layout"
import Person from "@/components/team/person"
import { fetchFullTeam } from "@/libs/api"

export default function MeetTheTeam({ fullTeam = [] }) {
  const url = "/meet-the-team"
  const title = "Meet the team"
  const description = "Our wonderful team member"
  const keywords = ["teams", "members"]
  const members = fullTeam.map(person => {
    // Build social media from social_links array
    const socialMedia = []

    // Add all social links from the API
    if (person.social_links && person.social_links.length > 0) {
      person.social_links.forEach(link => {
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
    if (person.email) {
      socialMedia.push({
        platform: "mail",
        identifier: person.email,
      })
    }

    return {
      name: person.name,
      role: person.role,
      social_media: socialMedia,
      photo: person.profile_picture,
      id: person.id,
    }
  })

  return (
    <>
      <Meta
        url={url}
        title={title}
        description={description}
        keywords={keywords}
      />
      <Layout>
        <Box px={8} pt={10} my={5} pos="relative">
          <Heading as="h2" size="2xl" textAlign="center">
            Meet the Team
          </Heading>
          <SimpleGrid
            marginTop={{ base: 6, md: 10 }}
            columns={{ base: 2, md: 4, lg: 5 }}
            gridColumnGap={{ base: 2, md: 4, lg: 6 }}
            gridRowGap={{ base: 4, md: 6, lg: 8 }}
          >
            {members.map(m => (
              <Person person={m} key={m.id} showSocmed={true} />
            ))}
          </SimpleGrid>
        </Box>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  try {
    const fullTeam = await fetchFullTeam()
    return {
      props: {
        fullTeam: fullTeam || [],
      },
      revalidate: 300, // Revalidate every 5 minutes
    }
  } catch (error) {
    console.error("Error fetching team:", error)
    return {
      props: {
        fullTeam: [],
      },
      revalidate: 60,
    }
  }
}
