import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApiQuery } from "../../hooks/useApi"; // adjust path as needed

const EmailChangeVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const new_email = searchParams.get("new_email");

  // Call the confirm email change endpoint
  const {
    isLoading,
    isError,
    error,
    isSuccess,
  } = useApiQuery<{ message: string }>(
    {
      route: "/api/auth/confirm-email-change",
      method: "POST",
    },
    {
      queryParams: token && new_email ? { token, new_email } : undefined,
    },
    {
      enabled: !!token && !!new_email,
    }
  );

  // Redirect if token or new_email missing
  useEffect(() => {
    if (!token || !new_email) {
      const timer = setTimeout(() => navigate("/settings/account"), 2000);
      return () => clearTimeout(timer);
    }
  }, [token, new_email, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text px-4 transition-colors duration-300">
      <div className="w-full max-w-md sm:max-w-lg bg-surface border border-border rounded-xl shadow-md p-8 text-center space-y-4 transition-colors duration-300">
        {isLoading && (
          <>
            <div className="flex justify-center">
              <div className="animate-spin h-10 w-10 rounded-full border-4 border-t-transparent border-accent" />
            </div>
            <h2 className="text-lg font-medium text-text">
              Verifying your new email...
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
            <h2 className="text-xl font-semibold text-red-600">
              Email change failed
            </h2>
            <p className="text-text/80">
              {(error as Error).message || "Invalid or expired verification link."}
            </p>
            <a
              href="/settings/account"
              className="inline-block mt-4 bg-button hover:opacity-90 text-buttonText px-4 py-2 rounded-md transition-colors"
            >
              Go back to account settings
            </a>
          </>
        )}

        {isSuccess && (
          <>
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
              Email changed successfully
            </h2>
            <p className="text-text/80">
              Your account email has been updated to{" "}
              <span className="font-medium">{new_email}</span>.
            </p>
            <a
              href="/settings/account"
              className="inline-block mt-4 bg-button hover:opacity-90 text-buttonText px-4 py-2 rounded-md transition-colors"
            >
              Go back to account settings
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailChangeVerifyPage;
