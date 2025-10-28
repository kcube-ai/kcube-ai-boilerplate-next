import { useState } from "react";
import { useApiMutation } from "../../hooks/useApi";

interface ForgotPasswordPayload {
  email: string;
}

interface ForgotPasswordResponse {
  detail: string;
}

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useApiMutation<ForgotPasswordResponse, ForgotPasswordPayload>(
    {
      route: "/api/auth/request-password-reset",
      method: "POST",
    },
    {
      onSuccess: (data) => {
        setError(null);
        setMessage(data.detail || "Check your email for reset instructions.");
      },
      onError: (err) => {
        setMessage(null);
        setError(err.message || "Something went wrong.");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    mutation.mutate({ email });
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
          <h1 className="text-2xl font-semibold mb-2">Forgot Password</h1>
          <p style={{ color: "var(--color-link)" }}>
            Enter your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {message && (
            <p
              className="text-sm text-center"
              style={{ color: "var(--color-link)" }}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full font-medium py-2 rounded-md transition-colors"
            style={{
              backgroundColor: "var(--color-button)",
              color: "var(--color-button-text)",
              opacity: mutation.isPending ? 0.8 : 1,
            }}
          >
            {mutation.isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p
          className="text-center text-sm mt-6"
          style={{ color: "var(--color-link)" }}
        >
          Remember your password?{" "}
          <a
            href="/login"
            style={{
              color: "var(--color-accent)",
              textDecoration: "underline",
            }}
          >
            Log in
          </a>
        </p>
      </div>

      <footer
        className="mt-8 text-xs text-center"
        style={{ color: "var(--color-link)" }}
      >
        © {new Date().getFullYear()} KCube AI Boilerplate
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;
