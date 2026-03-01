import { getSession } from "next-auth/react"
import { getAPIURL, getHeaders } from "@/libs/api"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const session = await getSession({ req })
    const { email, name, subject, message } = req.body

    // Validate required fields
    if (!message) {
      return res.status(400).json({ error: "Message is required" })
    }

    // Build request payload
    const payload = {
      message,
    }

    // For non-logged-in users, require email
    if (!session) {
      if (!email) {
        return res.status(400).json({ error: "Email is required" })
      }
      payload.email = email
      if (name) payload.name = name
    }

    // Add subject if provided
    if (subject) payload.subject = subject

    console.log("[/api/contact] Sending message:", {
      ...payload,
      message: payload.message.substring(0, 50) + "...",
    })

    const apiUrl = getAPIURL("/api/v1/messages")
    const headers = session
      ? getHeaders(true, session.accessToken)
      : getHeaders(false)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[/api/contact] Backend error:", errorData)
      return res
        .status(response.status)
        .json({ error: errorData.error || "Failed to send message" })
    }

    const data = await response.json()
    console.log("[/api/contact] Message sent successfully:", data.id)

    return res.status(201).json({
      message: "Message sent successfully",
      id: data.id,
    })
  } catch (error) {
    console.error("[/api/contact] Error:", error.message)
    return res.status(500).json({ error: error.message })
  }
}
