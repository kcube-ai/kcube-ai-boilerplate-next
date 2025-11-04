import { FileText } from "lucide-react";

export function ChatFiles() {
  return (
    <section id="chat-files">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Chat with Files
          </h2>
          <p className="text-muted-foreground">
            Upload documents and get instant insights
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Document Analysis
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Upload PDFs, spreadsheets, and other documents to chat with their
              contents. Our AI can extract information, summarize content, and
              answer questions about your files.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  How to Upload Files:
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                      1
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Navigate to the "Files" section from your dashboard
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                      2
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click "Upload" or drag and drop your files into the upload
                      area
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                      3
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Wait for the file to process (usually takes a few seconds)
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                      4
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Start asking questions about your document
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <h4 className="font-medium text-foreground mb-2">
                  Supported File Types:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>PDF Documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Excel Spreadsheets</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Word Documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>CSV Files</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">
                Example Use Cases:
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Summarize lengthy reports and contracts</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Extract specific data from invoices</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Analyze financial statements</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Compare data across multiple spreadsheets</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Find specific information in documents</span>
                </li>
              </ul>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    File Size Limit
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Maximum file size is 10MB per upload. For larger files,
                    consider splitting them into smaller sections.
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
