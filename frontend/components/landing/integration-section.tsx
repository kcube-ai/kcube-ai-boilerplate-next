import { DIMENSIONS, SPACING } from "@/constants/ui";
import { Check, Code, Loader2 } from "lucide-react";

export function IntegrationSection() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Extend with Modules or Build Your Own Features.
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Add new functionality using the modular architecture or customize
              existing features to match your specific requirements.
              <br />
              <br />
              The clean layered structure makes it easy to add API endpoints,
              business logic, and database operations without breaking existing code.
            </p>
          </div>

          {/* Right Column - Visual Demo */}
          <div className="relative">
            {/* Module List */}
            <div
              className={`bg-card border border-border ${DIMENSIONS.RADIUS_FILE_DROP} shadow-sample ${SPACING.CARD_PADDING} space-y-4 mb-6`}
            >
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Code
                    className={`${SPACING.ICON_SIZE} text-foreground`}
                  />
                  <span className="text-sm font-medium text-foreground">
                    modules/user/api.py
                  </span>
                </div>
                <Check className={`${SPACING.ICON_SIZE} text-green-500`} />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Code
                    className={`${SPACING.ICON_SIZE} text-foreground`}
                  />
                  <span className="text-sm font-medium text-foreground">
                    modules/two_fa/api.py
                  </span>
                </div>
                <Check className={`${SPACING.ICON_SIZE} text-green-500`} />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Code
                    className={`${SPACING.ICON_SIZE} text-muted-foreground`}
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    modules/my_feature/api.py
                  </span>
                </div>
                <Loader2
                  className={`${SPACING.ICON_SIZE} text-primary animate-spin`}
                />
              </div>
            </div>

            {/* Stack Icons */}
            <div className="flex justify-center items-center gap-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-sample-sm">
                <span className="text-primary-foreground font-bold text-xs">
                  FastAPI
                </span>
              </div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <div
                className={`w-16 h-16 bg-accent ${DIMENSIONS.RADIUS_SM} flex items-center justify-center shadow-sample-sm`}
              >
                <span className="text-foreground font-bold text-xs">Next.js</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
