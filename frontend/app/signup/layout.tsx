import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

export const metadata: Metadata = {
  title: `Sign Up - ${APP_NAME}`,
  description: `Create your ${APP_NAME} account and start analyzing your accounting data with powerful AI. Free trial available.`,
  keywords: [
    "sign up",
    "register",
    "create account",
    "free trial",
    "AI accounting software",
    "Sample registration",
  ],
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
