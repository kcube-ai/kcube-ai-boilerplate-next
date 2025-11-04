"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/config/app";
import { COMPONENT_CLASSES, LANDING_STYLES } from "@/constants/ui";
import { ThemeToggle } from "./theme-toggle";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav className="bg-muted border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-sample-blue">
                {APP_NAME}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="#security" className={LANDING_STYLES.NAV_LINK}>
                Security
              </Link>
              <Link href="#faqs" className={LANDING_STYLES.NAV_LINK}>
                FAQs
              </Link>
              <Link
                href="/support#book-demo"
                className={LANDING_STYLES.NAV_LINK}
              >
                Book a Demo
              </Link>
              <Link href="/support" className={LANDING_STYLES.NAV_LINK}>
                Support
              </Link>
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/signup">
              <Button className={COMPONENT_CLASSES.BUTTON_PRIMARY}>
                Start free trial
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className={COMPONENT_CLASSES.BUTTON_SECONDARY}
              >
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <Menu
                  className={`absolute inset-0 h-5 w-5 transform transition-all duration-300 ${
                    isOpen
                      ? "rotate-180 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 h-5 w-5 transform transition-all duration-300 ${
                    isOpen
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-180 scale-0 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-80 h-screen bg-background border-l border-border z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button - aligned with hamburger position */}
          <div className="flex items-center justify-end h-14 px-4 border-b border-border">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pt-6 pb-3 space-y-1">
              <Link
                href="#security"
                className={`${LANDING_STYLES.NAV_LINK_MOBILE} transition-colors`}
                onClick={() => setIsOpen(false)}
              >
                Security
              </Link>
              <Link
                href="#faqs"
                className={`${LANDING_STYLES.NAV_LINK_MOBILE} transition-colors`}
                onClick={() => setIsOpen(false)}
              >
                FAQs
              </Link>
              <Link
                href="/support#book-demo"
                className={`${LANDING_STYLES.NAV_LINK_MOBILE} transition-colors`}
                onClick={() => setIsOpen(false)}
              >
                Book a Demo
              </Link>
              <Link
                href="/support"
                className={`${LANDING_STYLES.NAV_LINK_MOBILE} transition-colors`}
                onClick={() => setIsOpen(false)}
              >
                Support
              </Link>
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="block"
              >
                <Button
                  className={`${COMPONENT_CLASSES.BUTTON_PRIMARY} w-full`}
                >
                  Start free trial
                </Button>
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block"
              >
                <Button
                  variant="outline"
                  className={`${COMPONENT_CLASSES.BUTTON_SECONDARY} w-full`}
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
