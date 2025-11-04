"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "./profile-dropdown";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex-1" />
        <ProfileDropdown />
      </div>
    </header>
  );
}
