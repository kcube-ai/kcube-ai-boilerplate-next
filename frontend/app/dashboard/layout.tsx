import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

export const metadata: Metadata = {
  title: `Dashboard - ${APP_NAME}`,
  description: `Access your ${APP_NAME} dashboard to analyze accounting data, view financial insights, and manage your business intelligence with AI.`,
  keywords: [
    "dashboard",
    "accounting analytics",
    "financial insights",
    "business intelligence",
    "AI analysis",
    "Sample dashboard",
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
