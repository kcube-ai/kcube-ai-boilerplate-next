import type { Metadata } from "next";

import { FAQSection } from "@/components/landing/faq-section";
import { FeatureCards } from "@/components/landing/feature-cards";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { IntegrationSection } from "@/components/landing/integration-section";
import { Navigation } from "@/components/landing/navigation";
import { PrivacySection } from "@/components/landing/privacy-section";
import { SecuritySection } from "@/components/landing/security-section";

export const metadata: Metadata = {
  title: "Sample AI - Full-Stack SaaS Application Template",
  description:
    "Modern full-stack SaaS application template with FastAPI backend and Next.js frontend. Features authentication, modular architecture, and production-ready infrastructure.",
  keywords: [
    "SaaS template",
    "FastAPI",
    "Next.js",
    "authentication",
    "full-stack",
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeatureCards />
        <IntegrationSection />
        <PrivacySection />
        <SecuritySection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
