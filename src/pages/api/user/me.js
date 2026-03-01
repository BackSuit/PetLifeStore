import { getSession } from "next-auth/react"
import { getAPIURL, getHeaders } from "@/libs/api"

async function refreshAccessToken(refreshToken) {
  try {
    console.log("[/api/user/me] Attempting to refresh token")
    const response = await fetch(getAPIURL("/api/v1/auth/refresh"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()
    console.log("[/api/user/me] Token refreshed successfully")
    return data.access_token
  } catch (error) {
    console.error("[/api/user/me] Token refresh failed:", error.message)
    return null
  }
}

export default async function handler(req, res) {
  const { method } = req
  const session = await getSession({ req })
  const cookieAccessToken = req.cookies?.access_token
  const cookieRefreshToken = req.cookies?.refresh_token

  console.log("[/api/user/me] Session exists:", !!session)
  console.log("[/api/user/me] Access token exists:", !!session?.accessToken)
  console.log("[/api/user/me] Cookie access token exists:", !!cookieAccessToken)

  // Prefer session tokens, but fall back to cookies set by OAuth callback
  const effectiveAccessToken = session?.accessToken || cookieAccessToken
  const effectiveRefreshToken = session?.refreshToken || cookieRefreshToken

  if (!effectiveAccessToken) {
    console.error("[/api/user/me] Unauthenticated - no session or token")
    return res.status(401).json({ error: "Unauthenticated" })
  }

  switch (method) {
    case "GET":
      try {
        const apiUrl = getAPIURL("/api/v1/auth/me")
        let accessToken = session.accessToken

        console.log("[/api/user/me] Fetching user from:", apiUrl)

        // First attempt with current token
        let response = await fetch(apiUrl, {
          headers: getHeaders(true, effectiveAccessToken),
        })

        // If token is invalid/expired, try to refresh
        if (response.status === 401 && effectiveRefreshToken) {
          console.log("[/api/user/me] Token expired, attempting refresh")

          const newAccessToken = await refreshAccessToken(effectiveRefreshToken)

          if (newAccessToken) {
            accessToken = newAccessToken
            // Retry with new token
            response = await fetch(apiUrl, {
              headers: getHeaders(true, accessToken),
            })

            // TODO: Update session with new token
            // This would require updating the JWT token in NextAuth
            console.log("[/api/user/me] Retrying with refreshed token")
          } else {
            console.error(
              "[/api/user/me] Token refresh failed, user needs to re-login"
            )
            return res.status(401).json({
              error: "Token expired and refresh failed. Please log in again.",
              requiresReauth: true,
            })
          }
        }

        if (!response.ok) {
          const errorText = await response.text()
          console.error(
            "[/api/user/me] Backend error:",
            response.status,
            errorText
          )
          throw new Error(`Backend returned ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        console.log("[/api/user/me] User fetched successfully:", {
          email: data.user?.email,
          profile_image: data.user?.profile_image,
          full_name: data.user?.full_name,
        })
        return res.json(data.user)
      } catch (error) {
        console.error("[/api/user/me] Error:", error.message)
        return res.status(500).json({ error: error.message })
      }

    case "PUT":
      try {
        const { full_name, username, profile_image } = req.body

        // Build update payload with only provided fields
        const updateData = {}
        if (full_name !== undefined) updateData.full_name = full_name
        if (username !== undefined) updateData.username = username
        if (profile_image !== undefined)
          updateData.profile_image = profile_image

        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ error: "No valid fields to update" })
        }

        console.log("[/api/user/me] Updating profile with:", updateData)

        let accessToken = effectiveAccessToken
        const apiUrl = getAPIURL("/api/v1/auth/profile")

        // First attempt with current token
        let response = await fetch(apiUrl, {
          method: "PATCH",
          headers: getHeaders(true, accessToken),
          body: JSON.stringify(updateData),
        })

        // If token is invalid/expired, try to refresh
        if (response.status === 401 && effectiveRefreshToken) {
          console.log(
            "[/api/user/me] Token expired during update, attempting refresh"
          )

          const newAccessToken = await refreshAccessToken(effectiveRefreshToken)

          if (newAccessToken) {
            accessToken = newAccessToken
            // Retry with new token
            response = await fetch(apiUrl, {
              method: "PATCH",
              headers: getHeaders(true, accessToken),
              body: JSON.stringify(updateData),
            })
          } else {
            return res.status(401).json({
              error: "Token expired and refresh failed. Please log in again.",
              requiresReauth: true,
            })
          }
        }

        if (!response.ok) {
          const errorData = await response.json()
          console.error("[/api/user/me] Update failed:", errorData)
          return res
            .status(response.status)
            .json({ error: errorData.error || "Failed to update profile" })
        }

        const data = await response.json()
        console.log("[/api/user/me] Profile updated successfully")
        return res.json(data.user)
      } catch (error) {
        console.error("[/api/user/me] Update error:", error.message)
        return res.status(500).json({ error: error.message })
      }

    default:
      console.error(`Unhandled method ${method}`)
      return res.status(500).json({ error: `Unhandled method: ${method}` })
  }
}
