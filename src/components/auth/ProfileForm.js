import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"

export default function ProfileForm({ isOpen, onClose }) {
  const [profile, setProfile] = useState({
    full_name: "",
    username: "",
    profile_image: "",
  })
  const [loading, setLoading] = useState("")
  const [msg, setMsg] = useState("")
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    // Only fetch when modal is open
    if (!isOpen) return

    setFetchError(null)
    fetch("/api/user/me")
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            // If token expired and needs re-auth, sign out
            if (data.requiresReauth) {
              setFetchError("Your session has expired. Please log in again.")
              setTimeout(() => {
                signOut()
              }, 2000)
              throw new Error("Session expired")
            }
            throw new Error(data.error || `Failed to fetch user: ${res.status}`)
          })
        }
        return res.json()
      })
      .then(data => {
        console.log("[ProfileForm] User data:", data)
        setProfile({
          full_name: data.full_name || "",
          username: data.username || "",
          profile_image: data.profile_image || "",
        })
      })
      .catch(err => {
        console.error("[ProfileForm] Error fetching user:", err)
        if (err.message !== "Session expired") {
          setFetchError(err.message)
        }
      })
  }, [isOpen])

  const handleChange = e => {
    setProfile(input => ({ ...input, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setMsg("")

    if (!profile.full_name && !profile.username && !profile.profile_image) {
      setMsg("Please fill at least one field.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/user/me", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      const data = await res.json()
      console.log("[ProfileForm] Profile updated:", data)
      setMsg("Profile updated successfully! Reload the page to see changes.")

      // Optionally refresh the user data after update
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("[ProfileForm] Update error:", error)
      setMsg(error.message || "Failed to update profile.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius={0}>
        <ModalHeader>Edit profile</ModalHeader>
        <ModalBody marginBottom={4}>
          {fetchError && (
            <Text color="red.500" fontSize="sm" mb={4}>
              Unable to load profile from backend: {fetchError}
            </Text>
          )}
          <VStack
            spacing={4}
            as="form"
            onSubmit={e => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <FormControl id="full_name">
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                borderRadius={0}
                borderColor="gray.500"
                _hover={{
                  borderColor: "gray.900",
                }}
              />
            </FormControl>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                borderRadius={0}
                borderColor="gray.500"
                _hover={{
                  borderColor: "gray.900",
                }}
              />
              <FormHelperText>Your unique username</FormHelperText>
            </FormControl>
            <FormControl id="profile_image">
              <FormLabel>Profile Image URL</FormLabel>
              <Input
                type="url"
                name="profile_image"
                value={profile.profile_image}
                onChange={handleChange}
                borderRadius={0}
                borderColor="gray.500"
                _hover={{
                  borderColor: "gray.900",
                }}
              />
              <FormHelperText>Your profile picture URL</FormHelperText>
            </FormControl>

            <Flex alignSelf="flex-end" alignItems="center" gap={2}>
              {msg && (
                <Text fontSize="sm" as="span" marginRight={2}>
                  {msg}
                </Text>
              )}
              <Button
                borderRadius={0}
                type="button"
                colorScheme="red"
                fontWeight="normal"
                px={8}
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                borderRadius={0}
                disabled={
                  !profile.full_name &&
                  !profile.username &&
                  !profile.profile_image
                }
                type="submit"
                colorScheme="blue"
                fontWeight="normal"
                px={8}
                isLoading={loading}
              >
                Update Profile
              </Button>
            </Flex>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
