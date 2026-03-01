import { fetchAPI } from "@/libs/api"
import GalleryPage from "@/module/gallery"

export default function gallery({ photos }) {
  return <GalleryPage photos={photos} />
}

export async function getStaticProps() {
  try {
    const photos = await fetchAPI("/photos?_sort=photographer.name")
    return {
      props: { photos },
      revalidate: 60, // Revalidate every 60 seconds (ISR)
    }
  } catch (error) {
    console.warn("Failed to fetch photos during build:", error.message)
    // Return empty photos array if API is unavailable during build
    return {
      props: { photos: [] },
      revalidate: 60, // Revalidate every 60 seconds (ISR)
    }
  }
}
