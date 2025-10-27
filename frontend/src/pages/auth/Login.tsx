import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface LoginPayload {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Invalid credentials");
      }
      return res.json();
    },
    onError: (err: any) => setError(err.message),
    onSuccess: () => {
      setError(null);
      window.location.href = "/chat"; // redirect after login
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate(form);
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

        <p className="text-center text-sm mt-6" style={{ color: "var(--color-link)" }}>
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
