import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const VerifyPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const {
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['verify-email', token],
    queryFn: async () => {
      if (!token) throw new Error('Missing verification token')
      const res = await fetch(
        `http://localhost:8000/api/auth/verify-email?token=${token}`
      )
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.detail || 'Verification failed')
      }
      return res.json()
    },
    enabled: !!token, // only run when token exists
  })

  useEffect(() => {
    if (!token) {
      // redirect to signup if no token
      const timer = setTimeout(() => navigate('/signup'), 2000)
      return () => clearTimeout(timer)
    }
  }, [token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#343541] px-4">
      <div className="w-full max-w-md sm:max-w-lg bg-white dark:bg-[#40414F] rounded-xl shadow-md p-8 text-center space-y-4">
        {isLoading && (
          <>
            <div className="flex justify-center">
              <div className="animate-spin h-10 w-10 rounded-full border-4 border-t-transparent border-[#10A37F]" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Verifying your email...
            </h2>
          </>
        )}

        {isError && (
          <>
            <div className="flex justify-center">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-500/10">
                <svg
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M12 2a10 10 0 100 20a10 10 0 000-20z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Verification failed
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {(error as Error).message || 'Invalid or expired link.'}
            </p>
            <a
              href="/signup"
              className="inline-block mt-4 bg-[#10A37F] hover:bg-[#0e8c6e] text-white px-4 py-2 rounded-md transition-colors"
            >
              Go back to signup
            </a>
          </>
        )}

        {isSuccess && (
          <>
            <div className="flex justify-center">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#10A37F]/10">
                <svg
                  className="h-6 w-6 text-[#10A37F]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0a9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Email verified successfully
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your email has been verified. You can now sign in to your account.
            </p>
            <a
              href="/login"
              className="inline-block mt-4 bg-[#10A37F] hover:bg-[#0e8c6e] text-white px-4 py-2 rounded-md transition-colors"
            >
              Go to login
            </a>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyPage
