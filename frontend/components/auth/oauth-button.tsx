"use client";

import { useState } from "react";

import { handleError } from "@/lib/error";
import { Loader2 } from "lucide-react";

interface OAuthButtonProps {
  provider: "google" | "xero";
  onGetAuthUrl: () => Promise<{ url: string }>;
  children: React.ReactNode;
  icon: React.ReactNode;
}

export function OAuthButton({
  provider,
  onGetAuthUrl,
  children,
  icon,
}: OAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const response = await onGetAuthUrl();
      window.location.href = response.url;
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      handleError(error);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
