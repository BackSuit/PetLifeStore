import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
  console.log("[Test Session] Environment variables:")
  console.log("  NEXT_AUTH_SECRET exists:", !!process.env.NEXT_AUTH_SECRET)
  console.log(
    "  NEXT_AUTH_SECRET length:",
    process.env.NEXT_AUTH_SECRET?.length
  )
  console.log("  NEXTAUTH_URL:", process.env.NEXTAUTH_URL)

  console.log("[Test Session] Cookies:", req.cookies)

  try {
    const session = await getServerSession(req, res, authOptions)
    console.log("[Test Session] Session retrieved:", session)

    return res.status(200).json({
      success: true,
      hasSession: !!session,
      session: session
        ? {
            userId: session.userId,
            email: session.user?.email,
            hasAccessToken: !!session.accessToken,
          }
        : null,
      cookies: Object.keys(req.cookies),
      env: {
        hasSecret: !!process.env.NEXT_AUTH_SECRET,
        secretLength: process.env.NEXT_AUTH_SECRET?.length,
        nextAuthUrl: process.env.NEXTAUTH_URL,
      },
    })
  } catch (error) {
    console.error("[Test Session] Error:", error)
    return res.status(500).json({
      success: false,
      error: error.message,
      env: {
        hasSecret: !!process.env.NEXT_AUTH_SECRET,
        secretLength: process.env.NEXT_AUTH_SECRET?.length,
      },
    })
  }
}
