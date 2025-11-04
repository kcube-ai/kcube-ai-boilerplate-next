import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

export const metadata: Metadata = {
  title: `Verify Email - ${APP_NAME}`,
  description: `Verify your email address to activate your ${APP_NAME} account and start using AI-powered accounting features.`,
  keywords: [
    "email verification",
    "verify account",
    "account activation",
    "email confirmation",
    "Sample verification",
  ],
};

export default function VerifySignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
