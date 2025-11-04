import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

export const metadata: Metadata = {
  title: `Reset Password - ${APP_NAME}`,
  description: `Create a new password for your ${APP_NAME} account. Enter your new password to regain access.`,
  keywords: [
    "reset password",
    "new password",
    "password change",
    "account security",
    "Sample reset",
  ],
};

export default function VerifyForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
