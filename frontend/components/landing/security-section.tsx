import { SPACING } from "@/constants/ui";
import { Database, Lock, Server, Shield } from "lucide-react";

export function SecuritySection() {
  return (
    <section id="security" className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Data Security Guarantee
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Featuring enterprise-grade encryption, secure cloud storage and
              rigorous access controls ensuring that your data is always safe.
            </p>
          </div>

          {/* Right Column - Visual */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Main Database Icon */}
              <div className="relative z-10">
                <Database className="w-32 h-32 text-primary" />
              </div>

              {/* Security Icons Around */}
              <div className="absolute -top-4 -left-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shadow-sample-sm border border-border">
                  <Lock className={`${SPACING.ICON_SIZE_LG} text-primary`} />
                </div>
              </div>

              <div className="absolute -top-4 -right-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shadow-sample-sm border border-border">
                  <Shield className={`${SPACING.ICON_SIZE_LG} text-primary`} />
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shadow-sample-sm border border-border">
                  <Server
                    className={`${SPACING.ICON_SIZE_LG} text-muted-foreground`}
                  />
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shadow-sample-sm border border-border">
                  <div
                    className={`${SPACING.ICON_SIZE_LG} bg-primary rounded-full`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
