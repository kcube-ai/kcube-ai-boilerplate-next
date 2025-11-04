"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { UsersService } from "@/app/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { handleError } from "@/lib/error";
import { clearToken } from "@/lib/token";

export function DeleteAccountSection() {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await UsersService.deleteApiV1UserDelete();

      // Clear token and redirect to login
      clearToken();

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted",
      });

      // Redirect after a short delay to allow toast to show
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      handleError(error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-card border border-destructive rounded-lg p-6 flex items-center justify-between gap-6">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-destructive mb-1">
          Delete Account
        </h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="px-4 py-2 text-sm flex-shrink-0"
            disabled={isDeleting}
          >
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
