"use client";

import { FileText, Loader2, RefreshCw, Trash2 } from "lucide-react";

import type { Document } from "@/app/client";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateFull, formatFileSize } from "@/lib/format";

import { StatusBadge } from "./status-badge";

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  isRefreshing: boolean;
  onDelete: (document: Document) => void;
  onRefresh: () => void;
}

export function DocumentList({
  documents,
  isLoading,
  isRefreshing,
  onDelete,
  onRefresh,
}: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Your Documents
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track your uploaded documents
          </p>
        </div>
        <div className="border rounded-lg bg-card">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Your Documents
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track your uploaded documents
          </p>
        </div>
        <div className="border rounded-lg bg-card">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No documents yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload your first document to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Your Documents
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track your uploaded documents
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {documents.map((document) => (
                <tr
                  key={document.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="max-w-md">
                        <div className="text-sm font-medium text-foreground truncate">
                          {document.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {document.size
                      ? (() => {
                          const match = document.size.match(/^(\d+)\s*bytes?$/i);
                          return match
                            ? formatFileSize(parseInt(match[1], 10))
                            : document.size;
                        })()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={document.status} />
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"
                    title={
                      document.created_at
                        ? formatDateFull(document.created_at)
                        : ""
                    }
                  >
                    {document.created_at
                      ? formatDate(document.created_at, false)
                      : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(document)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
