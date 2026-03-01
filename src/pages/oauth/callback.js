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
          // Get user info from backend
          const API_URL =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
          const userInfoUrl = `${API_URL}/api/v1/auth/me`

          console.log("[OAuth Callback] Fetching user info from:", userInfoUrl)

          const response = await fetch(userInfoUrl, {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
              "X-Tenant-ID": process.env.NEXT_PUBLIC_TENANT_ID || "1",
            },
          })

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
            user: data.user
              ? {
                  ...data.user,
                  email: data.user.email,
                  profile_image: data.user.profile_image,
                }
              : null,
          })

          // Store tokens in cookies for API routes to access
          console.log("[OAuth Callback] Storing tokens in cookies")
          document.cookie = `access_token=${access_token}; path=/; max-age=${
            60 * 60
          }` // 1 hour
          document.cookie = `refresh_token=${refresh_token}; path=/; max-age=${
            30 * 24 * 60 * 60
          }` // 30 days

          // Also store user info in localStorage
          localStorage.setItem("user", JSON.stringify(data.user))

          const user = {
            ...data.user,
            access_token,
            refresh_token,
          }

          console.log(
            "[OAuth Callback] Signing in with NextAuth (for session management)"
          )

          // Sign in with NextAuth (keeps existing functionality working)
          const result = await signIn("backend-oauth", {
            user: JSON.stringify(user),
            redirect: false,
          })

          console.log("[OAuth Callback] NextAuth signIn result:", result)

          // Get stored callback URL or default to home
          const callbackUrl =
            typeof window !== "undefined"
              ? sessionStorage.getItem("oauth_callback_url") || "/"
              : "/"

          console.log("[OAuth Callback] Redirecting to:", callbackUrl)

          // Clean up storage
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("oauth_callback_url")
          }

          router.push(callbackUrl)
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Signing you in...
        </h1>
        <div
          style={{
            border: "2px solid #e5e7eb",
            borderTop: "2px solid #111827",
            borderRadius: "50%",
            width: "3rem",
            height: "3rem",
            animation: "spin 1s linear infinite",
            margin: "0 auto",
          }}
        ></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}
