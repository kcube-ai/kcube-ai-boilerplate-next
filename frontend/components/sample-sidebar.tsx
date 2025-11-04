"use client";

import {
  BarChart3,
  FileText,
  MessageSquare,
  PlusCircle,
  Settings,
  Upload,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { COMPONENT_CLASSES, SAMPLE_LOGO, SPACING } from "@/constants/ui";
import { useUser } from "@/contexts/user-context";
import { cn } from "@/lib/utils";

const matchPath = (pathname: string, href: string) => {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
};

const SampleLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg
          width={SAMPLE_LOGO.SVG_SIZE}
          height={SAMPLE_LOGO.SVG_SIZE}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sampleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059FFF" />
              <stop offset="100%" stopColor="#0589e6" />
            </linearGradient>
          </defs>
          <circle
            cx={SAMPLE_LOGO.MAIN_CIRCLE.cx}
            cy={SAMPLE_LOGO.MAIN_CIRCLE.cy}
            r={SAMPLE_LOGO.MAIN_CIRCLE.r}
            fill="url(#sampleGradient)"
          />
          <circle
            cx={SAMPLE_LOGO.ACCENT_CIRCLE.cx}
            cy={SAMPLE_LOGO.ACCENT_CIRCLE.cy}
            r={SAMPLE_LOGO.ACCENT_CIRCLE.r}
            fill={SAMPLE_LOGO.ACCENT_COLOR}
            fillOpacity="0.7"
          />
          <circle
            cx={SAMPLE_LOGO.DOT.cx}
            cy={SAMPLE_LOGO.DOT.cy}
            r={SAMPLE_LOGO.DOT.r}
            fill={SAMPLE_LOGO.MAIN_COLOR}
          />
        </svg>
      </div>
      <span className="text-xl font-semibold">Sample AI</span>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
}

const NavItem = ({ href, icon: Icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        COMPONENT_CLASSES.NAV_ITEM,
        isActive && COMPONENT_CLASSES.NAV_ITEM_ACTIVE
      )}
    >
      <Icon className={SPACING.ICON_SIZE} />
      {label}
    </Link>
  );
};

export const SampleSidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  // Main navigation items for Sample AI
  const navigationItems = [
    {
      href: "/dashboard",
      icon: BarChart3,
      label: "Dashboard",
    },
    {
      href: "/chat",
      icon: MessageSquare,
      label: "AI Chat",
    },
    {
      href: "/documents",
      icon: FileText,
      label: "Documents",
    },
    {
      href: "/reports",
      icon: BarChart3,
      label: "Reports",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  // Quick actions for easy access
  const quickActions = [
    {
      href: "/chat",
      icon: PlusCircle,
      label: "New Chat",
    },
    {
      href: "/documents/upload",
      icon: Upload,
      label: "Upload Document",
    },
  ];

  return (
    <Sidebar className={COMPONENT_CLASSES.SIDEBAR_CONTAINER}>
      <SidebarHeader className={SPACING.SIDEBAR_PADDING}>
        <SampleLogo />
      </SidebarHeader>

      <SidebarContent className={SPACING.SIDEBAR_CONTENT_PADDING}>
        {/* Main Navigation */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-3">
            Main
          </div>
          {navigationItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={matchPath(pathname, item.href)}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 mt-8">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-3">
            Quick Actions
          </div>
          {quickActions.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className={SPACING.SIDEBAR_PADDING}>
        <div className="text-xs text-muted-foreground">
          {user?.email || "Not signed in"}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};