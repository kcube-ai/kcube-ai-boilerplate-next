import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

export const metadata: Metadata = {
  title: `Integrations - ${APP_NAME}`,
  description: `Connect your business applications and accounting software to ${APP_NAME} for seamless data synchronization and automated workflows.`,
  keywords: [
    "integrations",
    "business applications",
    "Xero integration",
    "accounting software",
    "data sync",
    "API connections",
  ],
};

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
