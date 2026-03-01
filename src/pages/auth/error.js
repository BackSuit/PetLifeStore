import { useRouter } from "next/router"
import Link from "next/link"

export default function AuthError() {
  const router = useRouter()
  const { error } = router.query

  const getErrorMessage = error => {
    switch (error) {
      case "access_denied":
        return "You denied access to your account. Please try again."
      case "invalid_provider":
        return "The authentication provider is not supported."
      case "oauth_failed":
        return "Authentication failed. Please try again."
      default:
        return "An unexpected error occurred during authentication."
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-center text-sm text-red-800">
              {getErrorMessage(error)}
            </p>
          </div>
        </div>
        <div className="mt-8">
          <Link
            href="/auth/signin"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  )
}
