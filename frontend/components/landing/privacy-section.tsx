import { APP_NAME } from "@/config/app";
import { DIMENSIONS, SPACING } from "@/constants/ui";
import { MessageSquare, Shield } from "lucide-react";

export function PrivacySection() {
  return (
    <section className="py-16 lg:py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Visual */}
          <div className="relative order-2 lg:order-1">
            <div
              className={`bg-card border border-border rounded-2xl shadow-sample ${SPACING.CARD_PADDING} max-w-md mx-auto`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <MessageSquare
                    className={`${SPACING.ICON_SIZE} text-primary-foreground`}
                  />
                </div>
                <div className="flex-1">
                  <div
                    className={`h-2 bg-muted ${DIMENSIONS.RADIUS_SM} mb-2`}
                  ></div>
                  <div
                    className={`h-2 bg-muted ${DIMENSIONS.RADIUS_SM} w-3/4`}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div
                  className={`h-3 bg-primary/20 ${DIMENSIONS.RADIUS_SM}`}
                ></div>
                <div
                  className={`h-3 bg-primary/20 ${DIMENSIONS.RADIUS_SM} w-5/6`}
                ></div>
                <div
                  className={`h-3 bg-primary/20 ${DIMENSIONS.RADIUS_SM} w-4/5`}
                ></div>
              </div>

              <div className="flex items-center justify-center">
                <Shield className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              {APP_NAME} personalizes your experience without compromising your
              data.
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Our AI does not train on or learn from your financial data.
              Instead, it uses secure, read-only access to your Xero accounting
              information to deliver fast, accurate insights tailored to your
              business.
              <br />
              <br />
              Your data stays private, and each Xero connection is fully
              isolated and protected.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
