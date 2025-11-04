import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

export const metadata: Metadata = {
  title: `Two-Factor Authentication - ${APP_NAME}`,
  description: `Enter your 6-digit verification code to complete two-factor authentication and secure your ${APP_NAME} account.`,
  keywords: [
    "two-factor authentication",
    "2FA",
    "verification code",
    "account security",
    "TOTP",
    "Sample 2FA",
  ],
};

export default function Verify2FALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
