/**
 * Server-side proxy for fetching authenticated user info from the backend.
 *
 * Client-side callback pages send the access_token here so that the
 * sensitive TENANT_ID never has to be exposed to the browser.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { token } = req.query

  if (!token) {
    return res.status(400).json({ error: "Missing token" })
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  const TENANT_ID = process.env.TENANT_ID

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(TENANT_ID ? { "X-Tenant-ID": TENANT_ID } : {}),
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error("[API /auth/me] Error:", error.message)
    return res.status(500).json({ error: "Failed to fetch user info" })
  }
}
