import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

export const metadata: Metadata = {
  title: `Support & Documentation - ${APP_NAME}`,
  description: `Get help with ${APP_NAME}. Learn how to connect Xero, chat with your accounting data, upload documents, and understand our security features.`,
  keywords: [
    "support",
    "documentation",
    "help center",
    "Xero integration guide",
    "user guide",
    "FAQ",
    "Sample support",
  ],
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
