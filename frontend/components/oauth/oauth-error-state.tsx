"use client";

import { useRouter } from "next/navigation";

interface OAuthErrorStateProps {
  error: string;
  redirectPath: string;
  buttonText: string;
}

export function OAuthErrorState({
  error,
  redirectPath,
  buttonText,
}: OAuthErrorStateProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mx-auto">
        <svg
          className="h-6 w-6 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-foreground">
        Authentication Failed
      </h2>
      <p className="text-sm text-muted-foreground">{error}</p>
      <button
        onClick={() => router.push(redirectPath)}
        className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {buttonText}
      </button>
    </div>
  );
}
