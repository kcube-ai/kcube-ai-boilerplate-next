"use client";

import { Loader2, Upload } from "lucide-react";
import { useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MAX_DOCUMENTS_PER_USER } from "@/config/app";

const ALLOWED_FILE_TYPES = [".pdf", ".xlsx", ".xls", ".pptx", ".ppt", ".txt"];

interface UploadSectionProps {
  isUploading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  documentCount: number;
}

export function UploadSection({
  isUploading,
  onFileSelect,
  documentCount,
}: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getCountBadgeVariant = () => {
    if (documentCount >= MAX_DOCUMENTS_PER_USER) return "destructive";
    if (documentCount >= 8) return "secondary";
    return "default";
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Upload Documents
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add documents for AI processing and analysis
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors max-w-md">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 bg-primary/5 rounded-lg">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <Badge variant={getCountBadgeVariant()}>
            {documentCount}/{MAX_DOCUMENTS_PER_USER}
          </Badge>
        </div>

        <h3 className="text-base font-semibold text-foreground mb-1">
          Upload Files
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Select documents to upload for AI processing
        </p>

        <div className="space-y-1 mb-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Formats:</span> {ALLOWED_FILE_TYPES.join(", ")}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Max size:</span> 10 MB per file
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(",")}
          onChange={onFileSelect}
          className="hidden"
        />
        <Button
          disabled={isUploading || documentCount >= MAX_DOCUMENTS_PER_USER}
          onClick={handleClick}
          size="sm"
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Select Files
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
