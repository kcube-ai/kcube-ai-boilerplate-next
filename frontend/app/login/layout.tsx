import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

export const metadata: Metadata = {
  title: `Login - ${APP_NAME}`,
  description: `Sign in to your ${APP_NAME} account to access your dashboard and manage your accounting data with AI-powered insights.`,
  keywords: [
    "login",
    "sign in",
    "authentication",
    "account access",
    "AI accounting",
    "Sample login",
  ],
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
