import { AiFillHome, AiOutlineHome } from "react-icons/ai"
import { BiCategory } from "react-icons/bi"

export const HOME_ROUTE = "/"
export const ARTICLE_ROUTE = "/article"
export const MAGAZINE_ROUTE = "/magazine"
export const GALLERY_ROUTE = "/gallery"
export const ENTERTAINMENT_ROUTE = "/entertainment"
export const AUTHORS_ROUTE = "/authors"
export const ABOUT_US_ROUTE = "/about-us"
export const MEET_THE_TEAM_ROUTE = "/meet-the-team"
export const CATEGORIES_ROUTE = "/category"

export const ARTICLE_ID_ROUTE = id => `${ARTICLE_ROUTE}/${id}`
export const CATEGORY_ID_ROUTE = id => `${CATEGORIES_ROUTE}/${id}`
export const AUTHOR_ID_ROUTE = id => `${AUTHORS_ROUTE}/${id}`
export const ARTICLE_PAGE_ROUTE = page => `${ARTICLE_ROUTE}/page/${page}`

// Generate navigation links from categories
export const getNavigationLinks = (categories = []) => {
  const links = [
    {
      name: "Home",
      to: HOME_ROUTE,
      icon: AiOutlineHome,
      activeIcon: AiFillHome,
    },
  ]

  // Add all category links to navbar
  categories.forEach(category => {
    links.push({
      name: category.name,
      to: CATEGORY_ID_ROUTE(category.slug),
      icon: BiCategory,
      activeIcon: BiCategory,
    })
  })

  return links
}

// Default navigation links (used as fallback)
export const navigationLinks = [
  {
    name: "Home",
    to: HOME_ROUTE,
    icon: AiOutlineHome,
    activeIcon: AiFillHome,
  },
]

// Footer links - organized for a book-focused site
export const footerLinks = [
  { name: "Home", path: HOME_ROUTE },
  { name: "All Articles", path: ARTICLE_ROUTE },
  { name: "Book Reviews", path: CATEGORY_ID_ROUTE("book-reviews") },
  { name: "Recommendations", path: CATEGORY_ID_ROUTE("recommendations") },
  { name: "New Releases", path: CATEGORY_ID_ROUTE("new-releases") },
  { name: "Authors", path: AUTHORS_ROUTE },
  { name: "About Us", path: ABOUT_US_ROUTE },
]

// Additional footer category links
export const footerCategoryLinks = [
  { name: "Fiction", path: CATEGORY_ID_ROUTE("fiction") },
  { name: "Non-Fiction", path: CATEGORY_ID_ROUTE("non-fiction") },
  { name: "Self-Help", path: CATEGORY_ID_ROUTE("self-help") },
  { name: "Business & Finance", path: CATEGORY_ID_ROUTE("business-finance") },
  { name: "Classics", path: CATEGORY_ID_ROUTE("classics") },
  { name: "Children & YA", path: CATEGORY_ID_ROUTE("children-ya") },
]
