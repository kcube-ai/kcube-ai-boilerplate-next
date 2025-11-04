import Link from "next/link";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/config/app";
import { ANIMATIONS, COMPONENT_CLASSES } from "@/constants/ui";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* CTA Section */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold">
                Ready to explore
              </h2>
              <p className="text-white/70 text-lg">
                Start your 14 day trial with access to all features or book a
                demo with our team.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className={`${COMPONENT_CLASSES.BUTTON_PRIMARY} font-bold w-full`}
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/support#book-demo" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className={`border-2 border-white text-white bg-transparent hover:bg-white hover:text-black font-bold px-8 ${ANIMATIONS.TRANSITION_DEFAULT} w-full`}
                >
                  Book a demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">{APP_NAME}</div>
              <span className="text-white/60">
                Copyright © 2024. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
