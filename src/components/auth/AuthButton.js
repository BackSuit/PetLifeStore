import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { FiLogOut, FiUser } from "react-icons/fi"
import {
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  MenuGroup,
  MenuDivider,
  useDisclosure,
} from "@chakra-ui/react"
import ProfileForm from "./ProfileForm"
import { getAPIURL } from "@/libs/api"

const AuthButton = () => {
  const { data: session, status } = useSession()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  // Get avatar image from session
  const avatarImage = useMemo(() => {
    const img = session?.user?.image || session?.user?.profile_image
    return img || ""
  }, [session?.user?.image, session?.user?.profile_image])

  const handleLogin = () => {
    // Store current URL to redirect back after login
    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname + window.location.search
      sessionStorage.setItem("oauth_callback_url", currentUrl)
      console.log("[Auth] Storing callback URL:", currentUrl)
    }

    // Redirect directly to backend OAuth endpoint
    const oauthUrl = getAPIURL("/api/v1/auth/oauth/google")
    console.log("[Auth] Redirecting to backend OAuth:", oauthUrl)
    console.log("[Auth] Backend should redirect to Google OAuth consent page")
    console.log(
      "[Auth] After Google consent, backend will redirect back to: /oauth/callback?access_token=...&refresh_token=..."
    )

    // Redirect to backend OAuth - backend will handle Google redirect
    window.location.href = oauthUrl
  }

  return (
    <>
      <Menu>
        <MenuButton>
          <Avatar
            size="sm"
            bg="gray.200"
            icon={<Icon as={FiUser} />}
            src={avatarImage}
            name={session?.user?.name || "User"}
            referrerPolicy="no-referrer"
          />
        </MenuButton>
        <MenuList borderRadius={false} borderColor="gray.200">
          {session && (
            <>
              <MenuGroup title="Profile">
                <MenuItem
                  onClick={onOpen}
                  icon={<Icon as={FiUser} />}
                  minH="48px"
                >
                  <span>My Account</span>
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuItem
                icon={<Icon as={FiLogOut} />}
                minH="48px"
                onClick={() => signOut()}
              >
                <span>Log out</span>
              </MenuItem>
            </>
          )}
          {!session && (
            <MenuItem minH="48px" onClick={handleLogin}>
              <span>Login</span>
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      {session && (
        <ProfileForm isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
      )}
    </>
  )
}

export default AuthButton
