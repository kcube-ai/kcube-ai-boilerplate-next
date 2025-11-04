"use client";

import { Bell, Search } from "lucide-react";

import { ProfileDropdown } from "@/components/profile-dropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SPACING } from "@/constants/ui";
import { useUser } from "@/contexts/user-context";

export const Header = () => {
  const { user } = useUser();

  return (
    <header className={`sticky top-0 z-10 flex ${SPACING.HEADER_HEIGHT} items-center justify-between border-b bg-background px-6`}>
      <div className="flex items-center gap-4 flex-1">
        {/* Search Bar */}
        <div className="relative max-w-md flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${SPACING.ICON_SIZE} text-muted-foreground`} />
          <Input
            placeholder="Search chats, documents..."
            className="pl-10 input-search"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className={SPACING.ICON_SIZE} />
        </Button>

        {/* User Profile */}
        <ProfileDropdown />
      </div>
    </header>
  );
};
