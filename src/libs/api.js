// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID

// Import site settings for category configuration
import siteSettings from "@/contents/site-settings.json"

// Helper function to get API URL
export function getAPIURL(path = "") {
  return `${API_BASE_URL}${path}`
}

// Helper function to get headers with tenant ID
export function getHeaders(includeAuth = false, token = null) {
  const headers = {
    "Content-Type": "application/json",
  }

  if (TENANT_ID) {
    headers["X-Tenant-ID"] = TENANT_ID
  }

  if (includeAuth && token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// Generic fetch function
export async function fetchAPI(path, options = {}) {
  try {
    const requestUrl = getAPIURL(path)
    const headers = options.headers || getHeaders()

    const response = await fetch(requestUrl, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("API Error:", error.message)
    throw error
  }
}

// Helper to normalize article data from API
function normalizeArticle(article) {
  return {
    ...article,
    image_url: article.image || article.image_url,
    category:
      typeof article.category === "string"
        ? {
            name: article.category,
            slug: article.category.toLowerCase().replace(/\s+/g, "-"),
          }
        : article.category,
    date: article.published_at || article.created_at,
    authors: article.authors || [],
  }
}

// Article Endpoints
export async function fetchArticles(params = {}) {
  const {
    status = "published",
    limit = 50,
    offset = 0,
    sort = "date",
    order = "desc",
  } = params
  const queryParams = new URLSearchParams({
    status,
    limit: limit.toString(),
    offset: offset.toString(),
    sort,
    order,
  })

  const data = await fetchAPI(`/api/v1/articles?${queryParams}`)
  return (data.articles || []).map(normalizeArticle)
}

export async function fetchHomeArticles(params = {}) {
  const articles = await fetchArticles({
    status: "published",
    is_featured: false,
    limit: 50,
    ...params,
  })
  return articles
}

export async function fetchFeatured() {
  const queryParams = new URLSearchParams({
    status: "published",
    is_featured: "true",
    limit: "2",
    offset: "1",
    sort: "date",
    order: "desc",
  })

  const data = await fetchAPI(`/api/v1/articles?${queryParams}`)
  return (data.articles || []).map(normalizeArticle)
}

export async function fetchHero() {
  const queryParams = new URLSearchParams({
    status: "published",
    is_featured: "true",
    limit: "1",
    sort: "date",
    order: "desc",
  })

  const data = await fetchAPI(`/api/v1/articles?${queryParams}`)
  return data.articles && data.articles.length > 0
    ? normalizeArticle(data.articles[0])
    : null
}

export async function fetchByCategory(slug) {
  if (!slug) return { articles: [], category: null }

  // Get the category metadata
  const categories = await fetchCategories()
  const category = categories.find(cat => cat.slug === slug)

  if (!category) return { articles: [], category: null }

  // Use category_slug query parameter for server-side filtering
  const queryParams = new URLSearchParams({
    category_slug: slug,
    status: "published",
    sort: "date",
    order: "desc",
  })

  const data = await fetchAPI(`/api/v1/articles?${queryParams}`)

  return {
    articles: (data.articles || []).map(normalizeArticle),
    category: { name: category.name, slug: category.slug },
  }
}

export async function fetchPaginated(page = 1, categorySlug = null) {
  const limit = siteSettings.posts_per_page || 9
  const offset = (page - 1) * limit

  const queryParams = new URLSearchParams({
    status: "published",
    limit: limit.toString(),
    offset: offset.toString(),
    sort: "date",
    order: "desc",
  })

  // Add category_slug if filtering by category
  if (categorySlug) {
    queryParams.append("category_slug", categorySlug)
  }

  const data = await fetchAPI(`/api/v1/articles?${queryParams}`)
  return (data.articles || []).map(normalizeArticle)
}

export async function fetchArticle(slug) {
  if (!slug) return null

  try {
    // First, try to get all articles and filter by slug
    // This is more reliable than search for exact slug matching
    const queryParams = new URLSearchParams({
      status: "published",
      limit: "1000", // Get a large number to ensure we find it
      sort: "date",
      order: "desc",
    })

    const data = await fetchAPI(`/api/v1/articles?${queryParams}`)
    const article = data.articles?.find(a => a.slug === slug)

    if (article) {
      // Get full article details with content
      const fullArticle = await fetchAPI(`/api/v1/articles/${article.id}`)
      return normalizeArticle(fullArticle.article)
    }

    // If not found in the main list, try search as fallback
    const searchData = await fetchAPI(
      `/api/v1/articles/search?q=${encodeURIComponent(slug)}&limit=50`
    )
    const searchArticle = searchData.results?.find(a => a.slug === slug)

    if (searchArticle) {
      const fullArticle = await fetchAPI(`/api/v1/articles/${searchArticle.id}`)
      return normalizeArticle(fullArticle.article)
    }

    return null
  } catch (error) {
    console.error("Error fetching article:", error)
    return null
  }
}

export async function fetchArticleSlugs() {
  try {
    const data = await fetchAPI(
      "/api/v1/articles?status=published&limit=1000&sort=title&order=asc"
    )
    return (data.articles || []).map(article => ({
      title: article.title,
      slug: article.slug,
    }))
  } catch (error) {
    console.error("Error fetching article slugs:", error)
    return []
  }
}

export async function countArticles() {
  const data = await fetchAPI("/api/v1/articles?status=published&limit=1")
  return data.total || 0
}

// Category Endpoints
export async function fetchCategories() {
  // Check if we should use API categories or predefined ones
  if (siteSettings.use_api_categories === false) {
    // Use predefined categories from site-settings.json
    return siteSettings.predefined_categories || []
  }

  // Otherwise, fetch from API
  try {
    const data = await fetchAPI("/api/v1/categories")
    return data.categories || []
  } catch (error) {
    console.error("Error fetching categories from API:", error)
    // Fallback to predefined categories if API fails
    return siteSettings.predefined_categories || []
  }
}

export async function fetchCategorySlug() {
  const categories = await fetchCategories()
  return categories.map(cat => ({
    name: cat.name,
    slug: cat.slug,
    description: cat.description || "",
  }))
}

// Author/User Endpoints (needs to be mapped to user endpoints)
export async function fetchAuthorsSlug() {
  // This would need a dedicated authors/users endpoint in the API
  // For now, return empty array or implement when backend supports it
  return []
}

export async function fetchAuthorArticles(slug) {
  if (!slug) return []
  // This would need filtering by author in the API
  // For now, return empty array or implement when backend supports it
  return []
}

export async function getAuthor(slug) {
  if (!slug) return null
  // This would need a dedicated author endpoint
  return null
}

// Slug validation
export async function checkSlug(slug) {
  try {
    const article = await fetchArticle(slug)
    return article !== null
  } catch (error) {
    return false
  }
}

// Team/Members Endpoints
export async function fetchTeamMembers(includeInactive = false) {
  try {
    const queryParams = new URLSearchParams()
    if (includeInactive) {
      queryParams.append("include_inactive", "true")
    }

    const data = await fetchAPI(
      `/api/v1/team${includeInactive ? "?" + queryParams : ""}`
    )
    return (data.team_members || []).map(member => ({
      id: member.id,
      name: member.full_name,
      role: member.role,
      position: member.position,
      email: member.email,
      phone: member.phone,
      profile_picture: member.profile_photo,
      bio: member.bio,
      social_links: member.social_links || [],
      is_active: member.is_active,
      display_order: member.display_order,
    }))
  } catch (error) {
    console.error("Error fetching team members:", error)
    return []
  }
}

export async function fetchManagerial() {
  // Fetch all active team members, they're already sorted by display_order
  return await fetchTeamMembers(false)
}

export async function fetchFullTeam() {
  // Fetch all active team members for the full team page
  return await fetchTeamMembers(false)
}

// Search Articles
export async function searchArticles(params = {}) {
  try {
    const {
      q,
      limit = 20,
      offset = 0,
      page,
      status = "published",
      category_id,
      category_slug,
      is_featured,
      date_from,
      date_to,
      sort = "relevance",
      order = "desc",
      search_in = "all",
    } = params

    const queryParams = new URLSearchParams()

    if (q) queryParams.append("q", q)
    queryParams.append("limit", limit.toString())

    if (page) {
      queryParams.append("page", page.toString())
    } else {
      queryParams.append("offset", offset.toString())
    }

    if (status) queryParams.append("status", status)
    if (category_id) queryParams.append("category_id", category_id.toString())
    if (category_slug) queryParams.append("category_slug", category_slug)
    if (is_featured !== undefined)
      queryParams.append("is_featured", is_featured.toString())
    if (date_from) queryParams.append("date_from", date_from)
    if (date_to) queryParams.append("date_to", date_to)
    if (sort) queryParams.append("sort", sort)
    if (order) queryParams.append("order", order)
    if (search_in) queryParams.append("search_in", search_in)

    const data = await fetchAPI(`/api/v1/articles/search?${queryParams}`)

    return {
      ...data,
      articles: (data.articles || []).map(normalizeArticle),
    }
  } catch (error) {
    console.error("Error searching articles:", error)
    return {
      articles: [],
      total: 0,
      query: params.q || "",
    }
  }
}

// Track article view
export async function trackArticleView(articleId) {
  if (!articleId) return

  try {
    await fetchAPI(`/api/v1/articles/${articleId}/view`, {
      method: "POST",
    })
  } catch (error) {
    console.error("Failed to track article view:", error)
  }
}
