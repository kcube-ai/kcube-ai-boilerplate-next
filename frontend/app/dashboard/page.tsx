"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { APP_NAME } from "@/config/app";
import { useUser } from "@/contexts/user-context";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  formatCurrentDate,
  formatCurrentTime,
  getTimeGreeting,
} from "@/lib/format";
import {
  ArrowRight,
  Building2,
  FileText,
  Plus,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  usePageTitle(`Dashboard - ${APP_NAME}`);
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState(formatCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatCurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: "Connected Organizations",
      count: user?.organizations_count || 0,
      description: "Active integrations",
      icon: Building2,
      href: "/integrations",
      action: "Connect New",
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Total Documents",
      count: user?.documents_count || 0,
      description: "Uploaded and indexed",
      icon: FileText,
      href: "/documents",
      action: "Upload Document",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <DashboardLayout>
      <div className="w-full max-w-[1400px] space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1.5">
            <h1 className="text-4xl font-bold tracking-tight text-foreground leading-none">
              Good {getTimeGreeting()},{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                {user?.full_name?.split(" ")[0]}
              </span>
            </h1>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">
                {formatCurrentDate()}
              </span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <span className="tabular-nums font-medium text-foreground">
                {currentTime}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Quick Actions</p>
              <div className="flex gap-2 mt-2">
                <Link href="/integrations">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Connect</span>
                  </Button>
                </Link>
                <Link href="/documents">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Upload</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div className="relative p-6 space-y-6">
                {/* Icon and Title */}
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div
                      className={`inline-flex p-3 rounded-xl ${stat.iconBg}`}
                    >
                      <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-bold text-foreground">
                          {stat.count}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {stat.description}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Link href={stat.href} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full group/btn"
                      size="sm"
                    >
                      View All
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href={stat.href}>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      {stat.action}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Quick Actions
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Common tasks to get you started
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href="/integrations"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
            >
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Connect Integration
                </p>
                <p className="text-xs text-muted-foreground">
                  Link your business apps
                </p>
              </div>
            </Link>

            <Link
              href="/documents"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
            >
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Upload Documents
                </p>
                <p className="text-xs text-muted-foreground">
                  Add new files for AI processing
                </p>
              </div>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
            >
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Account Settings
                </p>
                <p className="text-xs text-muted-foreground">
                  Manage your preferences
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
