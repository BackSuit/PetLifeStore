import ArticleLayout from "@/components/article/ArticleLayout"
import Layout from "@/components/layout"
import Meta from "@/components/meta"
import { Heading, Text, VStack } from "@chakra-ui/layout"
import config from "@/contents/site-settings.json"

export default function About() {
  const siteName = config.site_name || config.site_title

  return (
    <Layout>
      <ArticleLayout>
        <Meta
          title="About Us"
          description={`About ${siteName}`}
          url="/about-us"
          keywords={["About Us", `About ${siteName}`]}
        />
        <Heading mb={{ base: 4, md: 6 }} as="h1">
          About Us
        </Heading>
        <VStack spacing={4}>
          <Text>
            {siteName} is an independent online magazine focused on thoughtful
            journalism and long-form storytelling. We publish in-depth
            reporting, essays, interviews, and visual features that explore
            culture, technology, and the ideas that shape everyday life.
          </Text>

          <Text>
            Our mission is to give readers space to slow down and engage with
            stories that matter. We prioritize careful reporting, clear context,
            and rigorous sourcing so our audience can make informed decisions.
          </Text>

          <Text>
            Founded by a small team of writers and editors, {siteName} operates
            independently and is not affiliated with any prior organizations or
            projects. Editorial independence, transparency, and fairness guide
            everything we publish.
          </Text>

          <Text>
            We publish work from staff writers, contributors, and collaborating
            photographers. If you are interested in contributing, partnering, or
            sharing feedback, please visit our Meet the Team page or use the
            contact form on the site — we’d love to hear from you.
          </Text>

          <Text>
            Thank you for reading. We aim to create a place where curiosity and
            empathy meet — welcome to {siteName}.
          </Text>
        </VStack>
      </ArticleLayout>
    </Layout>
  )
}
