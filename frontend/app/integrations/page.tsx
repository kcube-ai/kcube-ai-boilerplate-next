"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { APP_NAME } from "@/config/app";
import { usePageTitle } from "@/hooks/use-page-title";

import { AvailableProvidersSection } from "./_components/available-providers-section";
import { ConnectedOrganizationsSection } from "./_components/connected-organizations-section";

export default function IntegrationsPage() {
  usePageTitle(`Integrations - ${APP_NAME}`);

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full max-w-[1400px]">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground mt-1">
            Connect your business applications to sync data and automate
            workflows
          </p>
        </div>
        <AvailableProvidersSection />
        <ConnectedOrganizationsSection />
      </div>
    </DashboardLayout>
  );
}
