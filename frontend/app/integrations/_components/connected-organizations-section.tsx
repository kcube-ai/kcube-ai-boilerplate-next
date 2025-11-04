"use client";

import { useEffect, useState } from "react";

import { XeroOrganization, XeroOrganizationService } from "@/app/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { handleError } from "@/lib/error";
import { formatDate, formatDateFull } from "@/lib/format";
import { Building2, RefreshCw, Unplug } from "lucide-react";

export function ConnectedOrganizationsSection() {
  const [organizations, setOrganizations] = useState<XeroOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrganizations = async () => {
    try {
      const data =
        await XeroOrganizationService.getListApiV1XeroOrganizationListGet();
      setOrganizations(data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const loadOrganizations = async () => {
      setIsLoading(true);
      await fetchOrganizations();
      setIsLoading(false);
    };

    loadOrganizations();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchOrganizations();
    } catch (error) {
      handleError(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "CONNECTED":
        return "default";
      case "PENDING":
        return "secondary";
      case "SYNCING":
      case "RESYNCING":
        return "secondary";
      case "FAILED":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Connected Organizations
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Organizations you have connected to Sample AI
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Connected Organizations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Organizations you have connected to Sample AI
          </p>
        </div>
        {organizations.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        )}
      </div>

      {organizations.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No organizations connected
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Connect to Xero or other providers above to start syncing your
              business data
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Connected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Sync
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {organizations.map((org) => (
                  <tr
                    key={org.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {org.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {org.tenant_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.585 14.655c-1.485 0-2.69-1.206-2.69-2.689 0-1.485 1.205-2.69 2.69-2.69 1.484 0 2.689 1.205 2.689 2.69 0 1.483-1.205 2.689-2.689 2.689zm-4.447-2.689c0-1.485-1.205-2.69-2.689-2.69-1.485 0-2.69 1.205-2.69 2.69 0 1.483 1.205 2.689 2.69 2.689 1.484 0 2.689-1.206 2.689-2.689zm-7.723 0c0-1.485-1.206-2.69-2.69-2.69C2.242 9.276 1.037 10.481 1.037 11.966c0 1.483 1.205 2.689 2.688 2.689 1.485 0 2.69-1.206 2.69-2.689z"
                            fill="#13B5EA"
                          />
                        </svg>
                        <span className="text-sm text-foreground">Xero</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={getStatusBadgeVariant(org.status || "PENDING")}
                      >
                        {org.status
                          ? org.status.charAt(0).toUpperCase() +
                            org.status.slice(1).toLowerCase()
                          : "Pending"}
                      </Badge>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"
                      title={
                        org.created_at ? formatDateFull(org.created_at) : ""
                      }
                    >
                      {org.created_at ? formatDate(org.created_at, false) : "-"}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"
                      title={
                        org.last_sync_at ? formatDateFull(org.last_sync_at) : ""
                      }
                    >
                      {org.last_sync_at
                        ? formatDate(org.last_sync_at)
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={true}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Unplug className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
