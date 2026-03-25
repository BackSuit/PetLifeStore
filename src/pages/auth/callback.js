import { useEffect } from "react"
import { useRouter } from "next/router"
import { signIn } from "next-auth/react"

export default function OAuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      console.log("[OAuth Callback] Starting callback handler")
      console.log("[OAuth Callback] Query params:", router.query)

      const { access_token, refresh_token, error, provider } = router.query

      if (error) {
        console.error("[OAuth Callback] OAuth error:", error)
        router.push(`/auth/error?error=${error}`)
        return
      }

      if (access_token) {
        console.log("[OAuth Callback] Access token received")
        console.log("[OAuth Callback] Token length:", access_token.length)

        try {
          // Fetch user info through the server-side proxy so that TENANT_ID
          // is never exposed to the browser bundle.
          const userInfoUrl = `/api/auth/me?token=${encodeURIComponent(
            access_token
          )}`

          console.log(
            "[OAuth Callback] Fetching user info via proxy:",
            userInfoUrl
          )

          const response = await fetch(userInfoUrl)

          console.log(
            "[OAuth Callback] User info response status:",
            response.status
          )

          if (!response.ok) {
            const errorText = await response.text()
            console.error(
              "[OAuth Callback] Failed to get user info:",
              errorText
            )
            throw new Error("Failed to get user info")
          }

          const data = await response.json()
          console.log("[OAuth Callback] User data received:", {
            ...data,
            user: data.user ? { ...data.user, email: data.user.email } : null,
          })

          const user = {
            ...data.user,
            access_token,
            refresh_token,
          }

          console.log(
            "[OAuth Callback] Signing in with NextAuth credentials provider"
          )

          // Sign in with credentials provider
          const result = await signIn("backend-oauth", {
            user: JSON.stringify(user),
            redirect: false,
          })

          console.log("[OAuth Callback] NextAuth signIn result:", result)

          if (result?.ok) {
            // Get stored callback URL or default to home
            const callbackUrl =
              typeof window !== "undefined"
                ? sessionStorage.getItem("oauth_callback_url") || "/"
                : "/"

            console.log(
              "[OAuth Callback] Sign in successful! Redirecting to:",
              callbackUrl
            )

            // Clean up storage
            if (typeof window !== "undefined") {
              sessionStorage.removeItem("oauth_callback_url")
            }

            router.push(callbackUrl)
          } else {
            console.error(
              "[OAuth Callback] NextAuth sign in failed:",
              result?.error
            )
            router.push("/auth/error?error=signin_failed")
          }
        } catch (err) {
          console.error("[OAuth Callback] Exception during sign in:", err)
          router.push("/auth/error?error=signin_failed")
        }
      } else {
        console.log("[OAuth Callback] No access token in query params")
      }
    }

    if (router.isReady) {
      handleCallback()
    }
  }, [router.isReady, router.query, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Signing you in...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  )
}
