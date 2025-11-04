import type { Metadata } from "next";

import { FAQSection } from "@/components/landing/faq-section";
import { FeatureCards } from "@/components/landing/feature-cards";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { IntegrationSection } from "@/components/landing/integration-section";
import { Navigation } from "@/components/landing/navigation";
import { PrivacySection } from "@/components/landing/privacy-section";
import { SecuritySection } from "@/components/landing/security-section";
import { VideoSection } from "@/components/landing/video-section";

export const metadata: Metadata = {
  title: "Sample AI - Analyze & Manage Accounting Data with Powerful AI",
  description:
    "AI-powered SaaS application designed to revolutionize the way you manage and analyze your accounting data. AI empowers businesses by providing accurate, timely, and insightful financial analysis.",
  keywords: [
    "AI",
    "accounting",
    "financial analysis",
    "Xero integration",
    "business intelligence",
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeatureCards />
        <VideoSection />
        <IntegrationSection />
        <PrivacySection />
        <SecuritySection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
