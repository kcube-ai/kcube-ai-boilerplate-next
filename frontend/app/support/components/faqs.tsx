import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { APP_NAME } from "@/config/app";

export function FAQs() {
  return (
    <section id="faqs">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Common questions about {APP_NAME}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Is my data secure with {APP_NAME}?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Yes, absolutely. We use enterprise-grade encryption for all
                  data in transit and at rest. Your data is stored in secure,
                  isolated databases and we implement strict access controls. We
                  only request read-only access to Xero, meaning we cannot
                  modify your accounting data. Additionally, your data is never
                  used to train AI models or shared with third parties.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                What types of questions can I ask about my Xero data?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-3">
                  You can ask virtually any question about your financial data
                  in natural language. Examples include:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Revenue and expense queries</li>
                  <li>Invoice status and aging reports</li>
                  <li>Cash flow analysis</li>
                  <li>Budget comparisons</li>
                  <li>Customer and supplier insights</li>
                  <li>Tax calculations and summaries</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  The AI understands context and can handle follow-up questions
                  for deeper analysis.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Can I upload multiple files at once?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upload multiple files simultaneously. Each file
                  is processed individually and you can chat with them
                  separately or ask questions that span across multiple
                  documents. The maximum file size per upload is 10MB.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                How often is my Xero data refreshed?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  We sync with Xero in real-time whenever you ask a question.
                  This ensures you always get the most up-to-date information
                  from your Xero account. You can also manually trigger a sync
                  if needed from the connectors page.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                Can I disconnect my Xero account?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Yes, you can disconnect your Xero account at any time from the
                  connectors page. Simply click the "Disconnect" button on the
                  Xero connector card. This will revoke {APP_NAME}'s access to
                  your Xero data. You can reconnect whenever you want.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>
                What happens to my files after I delete them?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  When you delete a file from {APP_NAME}, it is permanently
                  removed from our systems including all processed data and chat
                  history associated with that file. This action cannot be
                  undone, so please make sure you have local copies of any
                  important documents before deleting.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>
                Is there a limit to how many questions I can ask?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Currently, there are no hard limits on the number of questions
                  you can ask. However, we do have rate limiting in place to
                  ensure fair usage and system stability. If you need higher
                  limits for enterprise use, please contact our support team.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>
                Can I use {APP_NAME} on mobile devices?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Yes! {APP_NAME} is fully responsive and works on all modern
                  mobile browsers. Simply access the platform through your
                  mobile browser. A dedicated mobile app is in development and
                  will be available soon.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
