import { Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function ContactSupport() {
  return (
    <section className="bg-muted/50 border border-border rounded-lg p-8 text-center">
      <h2 className="text-2xl font-semibold text-foreground mb-4">
        Still Have Questions?
      </h2>
      <p className="text-muted-foreground mb-6">
        Our support team is here to help you
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="mailto:support@sample.au">
          <Button variant="default" size="lg" className="gap-2">
            <Mail className="h-4 w-4" />
            Email Support
          </Button>
        </a>
        <Link href="/">
          <Button variant="outline" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </section>
  );
}
