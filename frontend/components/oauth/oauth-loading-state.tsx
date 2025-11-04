interface OAuthLoadingStateProps {
  provider: string;
  message: string;
}

export function OAuthLoadingState({
  provider,
  message,
}: OAuthLoadingStateProps) {
  return (
    <div className="space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto animate-spin">
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-foreground">
        Authenticating with {provider}
      </h2>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
