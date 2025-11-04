import { APP_NAME } from "@/config/app";

export function GettingStarted() {
  return (
    <section id="getting-started">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Getting Started
          </h2>
          <p className="text-muted-foreground">
            Learn how to set up and start building with {APP_NAME}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Quick Setup Guide
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Clone the Repository
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Clone the template repository and navigate to the project
                    directory to begin setup.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Configure Environment
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Copy .env.example to .env and configure your database,
                    JWT secrets, email service, and other required settings.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Run Migrations
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Initialize your database with Alembic migrations to create
                    all necessary tables and schemas.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Start Development
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Run the backend with uvicorn and frontend with pnpm dev.
                    Your application is now ready for development!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> See the
              CLAUDE.md and ARCHITECTURE.md files in the repository for
              detailed setup instructions and architectural guidelines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
