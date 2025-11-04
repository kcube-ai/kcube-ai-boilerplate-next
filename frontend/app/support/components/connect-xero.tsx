import { Zap } from "lucide-react";

import { APP_NAME } from "@/config/app";

export function ConnectXero() {
  return (
    <section id="connect-xero">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Connect to Xero
          </h2>
          <p className="text-muted-foreground">
            Integrate your Xero account to access financial data
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Setting Up Xero Integration
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Access Connectors
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    From your dashboard, navigate to the "Connectors" section.
                    You'll see the Xero integration option with a "Connect"
                    button.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Authorize Connection
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Click the "Connect to Xero" button. You'll be redirected to
                    Xero's secure authorization page where you can log in to
                    your Xero account.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Select Organization
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    After logging in, you'll be asked to select which Xero
                    organization you want to connect. Choose your organization
                    and click "Allow Access".
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Confirmation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    You'll be redirected back to {APP_NAME} and your Xero
                    account will be connected. The connector card will now show
                    "Connected" status with your organization name.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex gap-3">
                <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Permissions
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {APP_NAME} requests read-only access to your Xero data. We
                    never modify your accounting data and only use it to provide
                    intelligent insights and answers to your questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Disconnecting Xero</h4>
            <p className="text-sm text-muted-foreground">
              To disconnect your Xero account, simply click the "Disconnect"
              button on the connector card. You can reconnect at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
