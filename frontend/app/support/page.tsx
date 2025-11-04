import { Book, Code, Database, Shield } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/landing/footer";
import { Navigation } from "@/components/landing/navigation";
import { APP_NAME } from "@/config/app";

export const metadata: Metadata = {
  title: `Documentation & Support - ${APP_NAME}`,
  description: "Complete documentation and guides for the Sample AI template",
};

const documentationSections = [
  {
    icon: Book,
    title: "Getting Started",
    description:
      "Learn how to set up the template, configure environment variables, and run your first application.",
    links: [
      { label: "Quick Start Guide", href: "#" },
      { label: "Environment Setup", href: "#" },
      { label: "Installation", href: "#" },
    ],
  },
  {
    icon: Code,
    title: "Backend Development",
    description:
      "Understand the FastAPI architecture, module system, and how to add new features to the backend.",
    links: [
      { label: "Architecture Overview", href: "#" },
      { label: "Creating Modules", href: "#" },
      { label: "API Endpoints", href: "#" },
    ],
  },
  {
    icon: Shield,
    title: "Authentication & Security",
    description:
      "Learn about JWT authentication, email verification, 2FA implementation, and security best practices.",
    links: [
      { label: "Authentication Flow", href: "#" },
      { label: "2FA Setup", href: "#" },
      { label: "Security Guidelines", href: "#" },
    ],
  },
  {
    icon: Database,
    title: "Database & Migrations",
    description:
      "Work with PostgreSQL, create models, run migrations, and manage database operations.",
    links: [
      { label: "Database Setup", href: "#" },
      { label: "Creating Models", href: "#" },
      { label: "Running Migrations", href: "#" },
    ],
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Documentation & Support
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Complete guides and documentation to help you build with {APP_NAME}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {documentationSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      {section.description}
                    </p>
                    <div className="space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="block text-sm text-primary hover:underline"
                        >
                          → {link.label}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-lg p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Need More Help?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out the complete documentation in the repository for detailed
              guides, architecture explanations, and best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild>
                <Link href="https://github.com/triplek-tech/sample-ai">
                  View on GitHub
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
