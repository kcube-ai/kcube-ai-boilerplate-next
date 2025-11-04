"use client";

import { useEffect, useRef, useState } from "react";

import type { Document } from "@/app/client";
import { DocumentService } from "@/app/client";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { APP_NAME, MAX_DOCUMENTS_PER_USER } from "@/config/app";
import { usePageTitle } from "@/hooks/use-page-title";
import { handleError } from "@/lib/error";

import { DeleteDialog } from "./_components/delete-dialog";
import { DocumentList } from "./_components/document-list";
import { UploadSection } from "./_components/upload-section";
import { ALLOWED_FILE_TYPES } from "./utils";

export default function DocumentsPage() {
  usePageTitle(`Documents - ${APP_NAME}`);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDocuments = async () => {
    const response = await DocumentService.getAllApiV1DocumentAllGet();
    setDocuments(response.documents || []);
  };

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      await fetchDocuments();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchDocuments();
    } catch (error) {
      handleError(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const hasProcessingDocs = documents.some(
      (doc) => doc.status === "PENDING" || doc.status === "PROCESSING"
    );

    if (hasProcessingDocs) {
      if (!pollingIntervalRef.current) {
        pollingIntervalRef.current = setInterval(async () => {
          try {
            await fetchDocuments();
          } catch (error) {
            handleError(error);
          }
        }, 3000);
      }
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [documents]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Check if upload would exceed total document limit
    if (documents.length + fileArray.length > MAX_DOCUMENTS_PER_USER) {
      alert(
        `You can have a maximum of ${MAX_DOCUMENTS_PER_USER} documents. You currently have ${documents.length} document(s). Please delete some documents before uploading more.`
      );
      event.target.value = "";
      return;
    }

    const invalidFiles = fileArray.filter((file) => {
      const extension = "." + file.name.split(".").pop()?.toLowerCase();
      return !ALLOWED_FILE_TYPES.includes(extension);
    });

    if (invalidFiles.length > 0) {
      alert(
        `Invalid file type(s). Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`
      );
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      await DocumentService.uploadApiV1DocumentPost({
        formData: { files: fileArray },
      });
      await fetchDocuments();
    } catch (error) {
      handleError(error);
    } finally {
      setIsUploading(false);
      const input = event.target;
      if (input) {
        input.value = "";
      }
    }
  };

  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete?.id) return;

    try {
      setIsDeleting(true);
      await DocumentService.deleteApiV1DocumentDelete({
        id: documentToDelete.id,
      });
      await fetchDocuments();
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-[1400px] space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your documents for AI processing
          </p>
        </div>

        <UploadSection
          isUploading={isUploading}
          onFileSelect={handleFileSelect}
          documentCount={documents.length}
        />

        <DocumentList
          documents={documents}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onDelete={handleDeleteClick}
          onRefresh={handleRefresh}
        />
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        document={documentToDelete}
        isDeleting={isDeleting}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </DashboardLayout>
  );
}
