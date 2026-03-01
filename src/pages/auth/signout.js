import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"

export default function SignOut() {
  const router = useRouter()

  useEffect(() => {
    console.log("[SignOut] Signing out and clearing session...")
    signOut({ redirect: false }).then(() => {
      console.log("[SignOut] Session cleared, redirecting to home...")
      router.push("/")
    })
  }, [router])

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
          Signing you out...
        </h1>
        <p style={{ color: "#666" }}>Clearing your session</p>
      </div>
    </div>
  )
}
