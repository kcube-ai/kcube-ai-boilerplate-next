import type React from "react";

import { APP_NAME } from "@/config/app";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">{APP_NAME}</h1>
        </div>
        {children}
        <div className="text-center text-sm text-muted-foreground">
          © 2025 {APP_NAME}. All rights reserved.
        </div>
      </div>
    </div>
  );
};
