import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

export const metadata: Metadata = {
  title: `Settings - ${APP_NAME}`,
  description: `Manage your ${APP_NAME} account settings, update profile information, configure security options, and customize your preferences.`,
  keywords: [
    "account settings",
    "profile settings",
    "security settings",
    "two-factor authentication setup",
    "password change",
    "Sample settings",
  ],
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
