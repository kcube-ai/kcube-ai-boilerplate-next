import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

interface RegisterPayload {
  first_name: string
  last_name: string
  email: string
  password: string
}

const SignupPage = () => {
  const [form, setForm] = useState<RegisterPayload>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Registration failed')
      }
      return res.json()
    },
    onError: (err: any) => {
      setError(err.message)
      setSuccess(false)
    },
    onSuccess: () => {
      setError(null)
      setSuccess(true)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    registerMutation.mutate(form)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#343541] px-4">
      <div className="w-full max-w-md sm:max-w-lg bg-white dark:bg-[#40414F] rounded-xl shadow-md p-8">
        {!success ? (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-6">
              Create your account
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-[#10A37F] hover:bg-[#0e8c6e] text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50"
              >
                {registerMutation.isPending
                  ? 'Creating account...'
                  : 'Sign up'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
              Already have an account?{' '}
              <a href="/login" className="text-[#10A37F] hover:underline">
                Log in
              </a>
            </p>
          </>
        ) : (
          <div className="text-center space-y-4">
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
              Check your email
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              A verification link has been sent to{' '}
              <span className="font-medium">{form.email}</span>. <br />
              Please check your inbox to verify your account.
            </p>
            <a
              href="/login"
              className="inline-block mt-4 bg-[#10A37F] hover:bg-[#0e8c6e] text-white px-4 py-2 rounded-md transition-colors"
            >
              Back to login
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignupPage
