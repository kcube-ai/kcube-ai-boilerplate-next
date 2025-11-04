"use client";

import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SPACING } from "@/constants/ui";
import { useUser } from "@/contexts/user-context";
import { getInitials } from "@/lib/format";
import { clearToken } from "@/lib/token";

export const ProfileDropdown = () => {
  const { user, setUser } = useUser();

  const fullName = user?.full_name ?? "";
  const email = user?.email ?? "";
  const initials = getInitials(fullName, email);

  const handleLogout = () => {
    setUser(null);
    clearToken();
    window.location.href = "/login";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1.5 h-auto rounded-lg"
        >
          <span className="text-sm font-medium text-foreground/80 truncate max-w-[160px]">
            {fullName || email}
          </span>
          <Avatar className={SPACING.AVATAR_SIZE}>
            <AvatarFallback className="bg-primary text-white text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className={SPACING.CHEVRON_SIZE} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[240px]">
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-white font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {fullName || email}
              </p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>
        </div>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2">
            <UserIcon className={SPACING.ICON_SIZE_SM} />
            <span>Profile Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className={SPACING.ICON_SIZE_SM} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
