"use client";

import { useState } from "react";

import { UsersService } from "@/app/client";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/contexts/user-context";
import { useToast } from "@/hooks/use-toast";
import { handleError } from "@/lib/error";
import { ERROR_MESSAGES, isValidPassword } from "@/lib/validation";

export function PasswordSection() {
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const hasPassword = user?.has_password ?? true;

  const handleCancel = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setIsOpen(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Only require old password if user has a password
    if (hasPassword && !oldPassword) {
      newErrors.oldPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    if (!newPassword) {
      newErrors.newPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidPassword(newPassword)) {
      newErrors.newPassword = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);

      if (hasPassword) {
        // Change existing password
        await UsersService.changePasswordApiV1UserChangePasswordPost({
          requestBody: {
            old_password: oldPassword,
            new_password: newPassword,
          },
        });
      } else {
        // Set password for OAuth users
        await UsersService.setPasswordApiV1UserSetPasswordPost({
          requestBody: {
            new_password: newPassword,
          },
        });
        // Update user state to reflect password is now set
        if (user) {
          setUser({ ...user, has_password: true });
        }
      }

      handleCancel();
      toast({
        title: "Success",
        description: hasPassword
          ? "Password changed successfully"
          : "Password set successfully",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Password
            </h3>
            <p className="text-sm text-muted-foreground">
              {hasPassword
                ? "Update your password regularly to keep your account secure. Use a strong password with at least 8 characters."
                : "Set a password to enable traditional email/password login in addition to OAuth."}
            </p>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 text-sm flex-shrink-0"
          >
            {hasPassword ? "Change Password" : "Set Password"}
          </Button>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {hasPassword ? "Change Password" : "Set Password"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {hasPassword
                ? "Enter your current password and choose a new one"
                : "Create a password to enable email/password login"}
            </p>
            {hasPassword && (
              <AuthInput
                id="oldPassword"
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={setOldPassword}
                error={errors.oldPassword}
                disabled={isLoading}
              />
            )}
            <AuthInput
              id="newPassword"
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={setNewPassword}
              error={errors.newPassword}
              disabled={isLoading}
            />
            <AuthInput
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={errors.confirmPassword}
              disabled={isLoading}
            />
            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading
                  ? hasPassword
                    ? "Changing..."
                    : "Setting..."
                  : hasPassword
                  ? "Change Password"
                  : "Set Password"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
