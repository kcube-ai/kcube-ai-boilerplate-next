"use client";

import { useState } from "react";

import { XeroOrganizationService } from "@/app/client";
import { Button } from "@/components/ui/button";
import { handleError } from "@/lib/error";
import { CheckCircle2, Loader2 } from "lucide-react";

const providers = [
  {
    id: "xero",
    name: "Xero",
    description:
      "Cloud-based accounting software for small and medium businesses",
    logo: (
      <svg className="h-12 w-12" viewBox="0 0 24 24">
        <path
          d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.585 14.655c-1.485 0-2.69-1.206-2.69-2.689 0-1.485 1.205-2.69 2.69-2.69 1.484 0 2.689 1.205 2.689 2.69 0 1.483-1.205 2.689-2.689 2.689zm-4.447-2.689c0-1.485-1.205-2.69-2.689-2.69-1.485 0-2.69 1.205-2.69 2.69 0 1.483 1.205 2.689 2.69 2.689 1.484 0 2.689-1.206 2.689-2.689zm-7.723 0c0-1.485-1.206-2.69-2.69-2.69C2.242 9.276 1.037 10.481 1.037 11.966c0 1.483 1.205 2.689 2.688 2.689 1.485 0 2.69-1.206 2.69-2.689z"
          fill="#13B5EA"
        />
      </svg>
    ),
    features: [
      "Sync financial data and transactions",
      "Real-time accounting insights",
      "Automated journal entries",
      "Secure OAuth 2.0 connection",
    ],
    isAvailable: true,
    getAuthUrl: () =>
      XeroOrganizationService.connectApiV1XeroOrganizationConnectGet(),
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Accounting software for businesses of all sizes",
    logo: (
      <svg className="h-12 w-12" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="6" fill="#2CA01C" />
        <text
          x="50%"
          y="50%"
          fill="white"
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Arial, sans-serif"
        >
          qb
        </text>
      </svg>
    ),
    features: [
      "Invoice and expense tracking",
      "Financial reporting",
      "Bank reconciliation",
      "Multi-currency support",
    ],
    isAvailable: false,
  },
];

export function AvailableProvidersSection() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleConnect = async (provider: (typeof providers)[0]) => {
    if (provider.isAvailable && provider.getAuthUrl) {
      try {
        setLoadingProvider(provider.id);
        const response = await provider.getAuthUrl();
        window.location.href = response.url;
      } catch (error) {
        handleError(error);
        setLoadingProvider(null);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Available Integrations
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect to your accounting and business software
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-shrink-0">{provider.logo}</div>
              {!provider.isAvailable && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  Coming Soon
                </span>
              )}
            </div>

            <h3 className="text-base font-semibold text-foreground mb-1">
              {provider.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {provider.description}
            </p>

            <ul className="space-y-1.5 mb-4">
              {provider.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start gap-1.5 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleConnect(provider)}
              disabled={
                !provider.isAvailable || loadingProvider === provider.id
              }
              className="w-full"
              size="sm"
              variant={provider.isAvailable ? "default" : "outline"}
            >
              {loadingProvider === provider.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Connecting...
                </>
              ) : provider.isAvailable ? (
                "Connect"
              ) : (
                "Coming Soon"
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
