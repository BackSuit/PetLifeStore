import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "backend-oauth",
      name: "Backend OAuth",
      credentials: {},
      async authorize(credentials) {
        try {
          // This is handled by our custom OAuth flow
          // Return user data from callback
          if (credentials?.user) {
            const user = JSON.parse(credentials.user)
            return user
          }
          return null
        } catch (error) {
          console.error("[NextAuth] Authorize error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      try {
        if (user) {
          token.accessToken = user.access_token
          token.refreshToken = user.refresh_token
          token.userId = user.id
          token.email = user.email
          token.name = user.full_name || user.username || user.email
          token.picture =
            user.profile_image || user.profile_picture || user.avatar || null
          token.tenantId = user.tenant_id
        }
        return token
      } catch (error) {
        console.error("[NextAuth] JWT callback error:", error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (!token) {
          console.error("[NextAuth] Session callback - no token")
          return session
        }

        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
        session.userId = token.userId
        session.tenantId = token.tenantId
        session.user = {
          id: token.userId,
          email: token.email,
          name: token.name,
          image: token.picture,
          profile_image: token.picture,
        }
        return session
      } catch (error) {
        console.error("[NextAuth] Session callback error:", error)
        return session
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXT_AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("[NextAuth Error]", code, metadata)
      if (code === "JWT_SESSION_ERROR") {
        console.error(
          "[NextAuth] Secret exists:",
          !!process.env.NEXT_AUTH_SECRET
        )
        console.error(
          "[NextAuth] Secret length:",
          process.env.NEXT_AUTH_SECRET?.length
        )
      }
    },
    warn(code) {
      console.warn("[NextAuth Warn]", code)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.log("[NextAuth Debug]", code, metadata)
      }
    },
  },
}

export default NextAuth(authOptions)
