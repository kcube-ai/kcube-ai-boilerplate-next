import { Book, MessageCircle } from "lucide-react";

export function ChatXero() {
  return (
    <section id="chat-xero">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Chat with Xero Data
          </h2>
          <p className="text-muted-foreground">
            Ask questions about your financial data using natural language
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Using the Xero Chat Interface
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Once your Xero account is connected, you can interact with your
              financial data through our AI-powered chat interface. Simply ask
              questions in plain English and get instant insights.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  Example Questions You Can Ask:
                </h4>
                <div className="space-y-2">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-foreground">
                      "What's my total revenue for this month?"
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-foreground">
                      "Show me my top 5 expenses from last quarter"
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-foreground">
                      "List all unpaid invoices"
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-foreground">
                      "What's my current cash position?"
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-foreground">
                      "Compare this year's revenue with last year"
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <h4 className="font-medium text-foreground mb-2">Features:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <MessageCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Real-time access to your latest Xero data</span>
                  </li>
                  <li className="flex gap-2">
                    <MessageCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      Natural language understanding - no need to know
                      accounting terminology
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <MessageCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      Contextual conversations - ask follow-up questions
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <MessageCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      Formatted responses with tables, charts, and summaries
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex gap-3">
                <Book className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Pro Tip
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Be specific with date ranges and categories to get more
                    accurate results. The AI understands relative dates like
                    "last month", "this quarter", or "year-to-date".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
