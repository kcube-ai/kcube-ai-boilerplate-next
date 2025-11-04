"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { BookDemoForm } from "@/components/book-demo-form";

export function BookDemo() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSuccess = (email: string) => {
    setSubmittedEmail(email);
    setSubmitted(true);
  };

  return (
    <section id="book-demo" className="scroll-mt-20">
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">Book a Demo</h2>
          <p className="text-lg text-muted-foreground">
            Interested in seeing how our platform can transform your business?
            Schedule a personalized demo with our team.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sample-sm p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {!submitted ? (
              <>
                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold text-foreground">
                    What to expect in your demo:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">
                        A personalized walkthrough tailored to your business
                        needs
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">
                        Live demonstration of AI-powered financial insights
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">
                        Q&A session to address your specific questions
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">
                        Discussion of integration with your existing systems
                      </p>
                    </li>
                  </ul>
                </div>

                <BookDemoForm onSuccess={handleSuccess} />
              </>
            ) : (
              <div className="space-y-6 text-center py-8">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground">
                    Request Submitted!
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for your interest! We&apos;ve received your demo
                    request and will reach out to you at{" "}
                    <span className="font-medium text-foreground">
                      {submittedEmail}
                    </span>{" "}
                    within 1-2 business days.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
