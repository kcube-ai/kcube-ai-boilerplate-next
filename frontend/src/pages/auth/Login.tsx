import { useState } from "react";
import { useApiMutation } from "../../hooks/useApi";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

const LoginPage = () => {
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useApiMutation<LoginResponse, LoginPayload>(
    {
      route: "/api/auth/login",
      method: "POST",
    },
    {
      onError: (err) => {
        setError(err.message);
      },
      onSuccess: (data) => {
        setError(null);
        localStorage.setItem("access_token", data.access_token);
        window.location.href = "/chat";
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate(form);
  };

  const handleOAuthLogin = (provider: "google" | "microsoft") => {
    window.location.href = `http://localhost:8000/api/oauth/${provider}/login`;
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-lg border p-8"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
          <p style={{ color: "var(--color-link)" }}>
            Log in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "var(--color-background)",
                border: `1px solid var(--color-border)`,
                color: "var(--color-text)",
                caretColor: "var(--color-accent)",
              }}
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "var(--color-background)",
                border: `1px solid var(--color-border)`,
                color: "var(--color-text)",
                caretColor: "var(--color-accent)",
              }}
            />

            {/* Forgot Password Link */}
            <div className="text-right mt-2">
              <a
                href="/forgot-password"
                className="text-sm transition-colors"
                style={{
                  color: "var(--color-link)",
                  textDecoration: "underline",
                }}
              >
                Forgot password?
              </a>
            </div>
          </div>

          {error && (
            <p
              className="text-sm text-center"
              style={{ color: "var(--color-accent)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full font-medium py-2 rounded-md transition-colors"
            style={{
              backgroundColor: "var(--color-button)",
              color: "var(--color-button-text)",
              opacity: loginMutation.isPending ? 0.8 : 1,
            }}
          >
            {loginMutation.isPending ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* --- Divider --- */}
        <div className="flex items-center my-6">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "var(--color-border)" }}
          ></div>
          <span
            className="px-3 text-sm"
            style={{ color: "var(--color-link)" }}
          >
            or
          </span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "var(--color-border)" }}
          ></div>
        </div>

        {/* --- OAuth Buttons --- */}
        <div className="space-y-3">
          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all"
            style={{
              backgroundColor: "white",
              border: "1px solid var(--color-border)",
              color: "#202124",
            }}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuthLogin("microsoft")}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all"
            style={{
              backgroundColor: "#2F2F2F",
              color: "#FFFFFF",
            }}
          >
            <img
              src="https://www.svgrepo.com/show/448239/microsoft.svg"
              alt="Microsoft"
              className="w-5 h-5 bg-white rounded-sm"
            />
            Continue with Microsoft
          </button>
        </div>

        <p
          className="text-center text-sm mt-6"
          style={{ color: "var(--color-link)" }}
        >
          Don’t have an account?{" "}
          <a
            href="/signup"
            style={{
              color: "var(--color-accent)",
              textDecoration: "underline",
            }}
          >
            Sign up
          </a>
        </p>
      </div>

      <footer
        className="mt-8 text-xs text-center"
        style={{ color: "var(--color-link)" }}
      >
        © {new Date().getFullYear()} Chatbot AI. Inspired by ChatGPT.
      </footer>
    </div>
  );
};

export default LoginPage;
