import ArticleLayout from "@/components/article/ArticleLayout"
import Layout from "@/components/layout"
import Meta from "@/components/meta"
import { Box, Heading, ListItem, OrderedList } from "@chakra-ui/react"
import Link from "next/link"
import config from "@/contents/site-settings.json"

export default function TermsOfServicePage() {
  const siteName = config.site_name || config.site_title
  const baseUrl = config.base_url || "https://prettylong.com"

  return (
    <Layout>
      <ArticleLayout>
        <Meta
          title="Terms of Service"
          description={`Terms of Service of ${siteName}`}
        />

        <Box mb={6}>
          <Heading size="xl" as="h1" mb={4}>
            Terms of Service of {siteName}
          </Heading>
          <OrderedList spacing={4}>
            <ListItem>
              <Box as="strong" fontWeight="bold" display="block" mb={2}>
                Terms
              </Box>
              By accessing this Website, accessible from {baseUrl}, you are
              agreeing to be bound by these Website Terms and Conditions of Use
              and agree that you are responsible for the agreement with any
              applicable local laws. If you disagree with any of these terms,
              you are prohibited from accessing this site. The materials
              contained in this Website are protected by copyright and trade
              mark law.
            </ListItem>
            <ListItem>
              <Box as="strong" fontWeight="bold" display="block" mb={2}>
                Use License
              </Box>
              Permission is granted to temporarily download one copy of the
              materials on {siteName}'s Website for personal, non-commercial
              transitory viewing only. This is the grant of a license, not a
              transfer of title, and under this license you may not: modify or
              copy the materials; use the materials for any commercial purpose
              or for any public display; attempt to reverse engineer any
              software contained on {siteName}'s Website; remove any copyright
              or other proprietary notations from the materials; or transferring
              the materials to another person or "mirror" the materials on any
              other server. This will let {siteName} to terminate upon
              violations of any of these restrictions. Upon termination, your
              viewing right will also be terminated and you should destroy any
              downloaded materials in your possession whether it is printed or
              electronic format.
            </ListItem>
            <ListItem>
              <Box as="strong" fontWeight="bold" display="block" mb={2}>
                Disclaimer
              </Box>
              All the materials on {siteName}'s Website are provided "as is".{" "}
              {siteName} makes no warranties, may it be expressed or implied,
              therefore negates all other warranties. Furthermore, {siteName}{" "}
              does not make any representations concerning the accuracy or
              reliability of the use of the materials on its Website or
              otherwise relating to such materials or any sites linked to this
              Website.
            </ListItem>
            <ListItem>
              <Box as="strong" fontWeight="bold" display="block" mb={2}>
                Limitations
              </Box>
              {siteName} or its suppliers will not be hold accountable for any
              damages that will arise with the use or inability to use the
              materials on {siteName}'s Website, even if {siteName} or an
              authorize representative of this Website has been notified, orally
              or written, of the possibility of such damage. Some jurisdiction
              does not allow limitations on implied warranties or limitations of
              liability for incidental damages, these limitations may not apply
              to you.
            </ListItem>
            <ListItem>
              <Box as="strong" fontWeight="bold" display="block" mb={2}>
                Revisions and Errata
              </Box>
              The materials appearing on {siteName}'s Website may include
              technical, typographical, or photographic errors. {siteName} will
              not promise that any of the materials in this Website are
              accurate, complete, or current. {siteName} may change the
              materials contained on its Website at any time without notice.{" "}
              {siteName} does not make any commitment to update the materials.
            </ListItem>
            <ListItem>
              <Box as="strong" fontWeight="bold" display="block" mb={2}>
                Links
              </Box>
              {siteName} has not reviewed all of the sites linked to its Website
              and is not responsible for the contents of any such linked site.
              The presence of any link does not imply endorsement by {siteName}{" "}
              of the site. The use of any linked website is at the user's own
              risk.
            </ListItem>
            <ListItem>
              <Box as="strong" fontWeight="bold" display="block" mb={2}>
                Site Terms of Use Modifications
              </Box>
              {siteName} may revise these Terms of Use for its Website at any
              time without prior notice. By using this Website, you are agreeing
              to be bound by the current version of these Terms and Conditions
              of Use.
            </ListItem>
            <ListItem>
              <Box as="strong" fontWeight="bold" display="block" mb={2}>
                Your Privacy
              </Box>
              Please read our{" "}
              <Box
                as={Link}
                href="/privacy-policy"
                textDecor="underline"
                cursor="pointer"
                color="blue.600"
                display="inline"
              >
                Privacy Policy
              </Box>
              .
            </ListItem>
            <ListItem>
              <Box as="strong" fontWeight="bold" display="block" mb={2}>
                Governing Law
              </Box>
              Any claim related to {siteName}'s Website shall be governed by the
              laws of Nepal without regards to its conflict of law provisions.
            </ListItem>
          </OrderedList>
        </Box>
      </ArticleLayout>
    </Layout>
  )
}
