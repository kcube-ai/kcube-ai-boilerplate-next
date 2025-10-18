"use client";

import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

import "@/app/globals.css";
import "./init";

import { UsersService } from "@/app/client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider, useUser } from "@/contexts/user-context";
import { isLoggedIn } from "@/lib/auth";
import { handleError } from "@/lib/error";

const guestRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-forgot-password",
  "/google-oauth-redirect",
];
const authenticatedRoutes = [
  "/verify-signup",
  "/verify-2fa",
  "/dashboard",
  "/settings",
  "/documents",
];

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUser();

  // During SSR, show nothing
  if (typeof window === "undefined") {
    return null;
  }

  // Check if logged in
  if (!isLoggedIn()) {
    router.replace("/login");
    return null;
  }

  useEffect(() => {
    const fetchAndCheckUser = async () => {
      // Fetch user if not loaded
      if (!user) {
        try {
          const userData = await UsersService.getMeApiV1UserMeGet();
          setUser(userData);
        } catch (error) {
          handleError(error);
        }
        return;
      }

      // User is loaded, check 2FA verification first
      if (user.pending_2fa && pathname !== "/verify-2fa") {
        router.replace("/verify-2fa");
        return;
      }

      if (!user.pending_2fa && pathname === "/verify-2fa") {
        router.replace("/dashboard");
        return;
      }

      // Then check email verification
      if (!user.signup_verified && pathname !== "/verify-signup") {
        router.replace("/verify-signup");
        return;
      }

      if (user.signup_verified && pathname === "/verify-signup") {
        router.replace("/dashboard");
        return;
      }
    };

    fetchAndCheckUser();
  }, [user, setUser, pathname, router]);

  // Show loading state while user is being fetched
  if (!user) {
    return null;
  }

  // Don't render if redirects are needed (2FA check first)
  if (user.pending_2fa && pathname !== "/verify-2fa") {
    return null;
  }

  if (!user.pending_2fa && pathname === "/verify-2fa") {
    return null;
  }

  // Then email verification check
  if (!user.signup_verified && pathname !== "/verify-signup") {
    return null;
  }

  if (user.signup_verified && pathname === "/verify-signup") {
    return null;
  }

  return <>{children}</>;
};

const GuestChecker = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isLoggedIn()) {
      router.replace("/dashboard");
    }
  }, [router]);

  // During SSR or if logged in, show nothing (will redirect)
  if (typeof window === "undefined" || isLoggedIn()) {
    return null;
  }

  return <>{children}</>;
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Check if route is guest route
  if (guestRoutes.some((route) => pathname === route)) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-background font-sans antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <GuestChecker>{children}</GuestChecker>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    );
  }

  // Check if route is authenticated route
  if (authenticatedRoutes.some((route) => pathname.startsWith(route))) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-background font-sans antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider>
              <AuthChecker>{children}</AuthChecker>
              <Toaster />
            </UserProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  }

  // All other routes
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
