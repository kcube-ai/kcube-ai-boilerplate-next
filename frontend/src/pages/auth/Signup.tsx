import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const [form, setForm] = useState<RegisterPayload>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Registration failed");
      }
      return res.json();
    },
    onError: (err: any) => {
      setError(err.message);
      setSuccess(false);
    },
    onSuccess: () => {
      setError(null);
      setSuccess(true);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    registerMutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text px-4 transition-colors duration-300">
      <div className="w-full max-w-md sm:max-w-lg bg-surface border border-border rounded-xl shadow-md p-8 transition-colors duration-300">
        {!success ? (
          <>
            <h1 className="text-2xl font-semibold text-text text-center mb-6">
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
                  className="w-full sm:w-1/2 px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="w-full sm:w-1/2 px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-button hover:opacity-90 text-buttonText font-medium py-2 rounded-md transition-colors disabled:opacity-50"
              >
                {registerMutation.isPending
                  ? "Creating account..."
                  : "Sign up"}
              </button>
            </form>

            <p className="text-center text-sm mt-6 text-text/80">
              Already have an account?{" "}
              <a href="/login" className="text-link hover:underline">
                Log in
              </a>
            </p>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-accent/10">
                <svg
                  className="h-6 w-6 text-accent"
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
            <h2 className="text-xl font-semibold text-text">
              Check your email
            </h2>
            <p className="text-text/80">
              A verification link has been sent to{" "}
              <span className="font-medium">{form.email}</span>. <br />
              Please check your inbox to verify your account.
            </p>
            <a
              href="/login"
              className="inline-block mt-4 bg-button hover:opacity-90 text-buttonText px-4 py-2 rounded-md transition-colors"
            >
              Back to login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
