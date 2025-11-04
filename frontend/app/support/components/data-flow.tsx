import { APP_NAME } from "@/config/app";

export function DataFlow() {
  return (
    <section id="data-flow">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Data Flow
          </h2>
          <p className="text-muted-foreground">
            Understanding how your data is processed and protected
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              How {APP_NAME} Works
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your data security and privacy are our top priorities. Here's how
              data flows through our system:
            </p>
            <div className="space-y-6">
              <div className="relative">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        1
                      </div>
                      <div className="w-0.5 flex-1 bg-border mt-2"></div>
                    </div>
                    <div className="pb-8">
                      <h4 className="font-medium text-foreground mb-2">
                        Data Connection
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        When you connect to Xero or upload files, you're
                        establishing a secure, encrypted connection. All data
                        transmission uses industry-standard TLS encryption.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        2
                      </div>
                      <div className="w-0.5 flex-1 bg-border mt-2"></div>
                    </div>
                    <div className="pb-8">
                      <h4 className="font-medium text-foreground mb-2">
                        Secure Storage
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your data is stored in encrypted databases hosted on
                        secure cloud infrastructure. We use enterprise-grade
                        encryption at rest and implement strict access controls.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        3
                      </div>
                      <div className="w-0.5 flex-1 bg-border mt-2"></div>
                    </div>
                    <div className="pb-8">
                      <h4 className="font-medium text-foreground mb-2">
                        AI Processing
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        When you ask a question, only the relevant data is
                        retrieved and sent to our AI engine. The AI processes
                        your query and generates insights based on your specific
                        data.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        4
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Response Delivery
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        The AI-generated response is delivered back to you
                        through our secure interface. Your data never leaves our
                        secure environment and is never used to train AI models.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-3">
                  Security Commitments:
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-foreground mb-1">
                      Read-Only Access
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      We only request read-only permissions for Xero. We cannot
                      modify your accounting data.
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-foreground mb-1">
                      Data Isolation
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      Your data is completely isolated from other users. No
                      cross-contamination.
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-foreground mb-1">
                      No AI Training
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      Your data is never used to train AI models or shared with
                      third parties.
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-foreground mb-1">
                      Full Control
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      You can disconnect integrations or delete your data at any
                      time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
