import { useState, useEffect } from "react";
import { useApiMutation } from "../../hooks/useApi";

interface ResetPasswordPayload {
  password: string;
}

const ResetPasswordPage = () => {
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState<ResetPasswordPayload>({ password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);
  }, []);

  const resetMutation = useApiMutation<any, ResetPasswordPayload>(
    {
      route: token ? `/api/auth/reset-password?token=${token}` : "",
      method: "POST",
    },
    {
      onError: (err) => {
        setError(err.message);
      },
      onSuccess: () => {
        setError(null);
        setSuccess(true);
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ password: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing token");
      return;
    }
    setError(null);
    resetMutation.mutate(form);
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
        <h1 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h1>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter your new password"
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
              disabled={resetMutation.isPending}
              className="w-full font-medium py-2 rounded-md transition-colors"
              style={{
                backgroundColor: "var(--color-button)",
                color: "var(--color-button-text)",
                opacity: resetMutation.isPending ? 0.8 : 1,
              }}
            >
              {resetMutation.isPending ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p>Password reset successful! You can now log in.</p>
            <a
              href="/login"
              className="inline-block font-medium py-2 px-4 rounded-md transition-colors"
              style={{
                backgroundColor: "var(--color-button)",
                color: "var(--color-button-text)",
              }}
            >
              Go to Login
            </a>
          </div>
        )}
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

export default ResetPasswordPage;
