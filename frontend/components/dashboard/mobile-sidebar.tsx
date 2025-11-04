"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FileText,
  Home,
  LogOut,
  Settings,
  X,
  Puzzle,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { clearToken } from "@/lib/token";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Integrations", href: "/integrations", icon: Puzzle },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const handleLogout = () => {
    clearToken();
    window.location.href = "/login";
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 left-0 w-64 bg-muted border-r border-border z-50 lg:hidden">
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-sample-blue"
            onClick={onClose}
          >
            Sample
          </Link>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-muted p-4 space-y-3">
          {user && (
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground truncate">
                {user.full_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
