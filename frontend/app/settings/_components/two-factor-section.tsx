"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

import { TwoFaService } from "@/app/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/contexts/user-context";
import { handleError } from "@/lib/error";

export function TwoFactorSection() {
  const { user, refreshUser } = useUser();
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"qr" | "verify">("qr");

  const handleEnableStart = async () => {
    try {
      setIsLoading(true);
      const response = await TwoFaService.setupApiV1TwoFaSetupGet();
      setQrUrl(response.url);
      setShowEnableModal(true);
      setStep("qr");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      await TwoFaService.verifyApiV1TwoFaVerifyPost({
        requestBody: { totp: totpCode },
      });
      setShowEnableModal(false);
      setTotpCode("");
      await refreshUser();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    if (
      !confirm("Are you sure you want to disable two-factor authentication?")
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await TwoFaService.disableApiV1TwoFaDisablePost();
      await refreshUser();
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
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account. When enabled,
              you'll need to enter a code from your authenticator app in
              addition to your password.
            </p>
            <p className="text-sm font-medium text-foreground mt-3">
              Status:{" "}
              <span
                className={
                  user?.two_fa_enabled ? "text-green-600" : "text-muted-foreground"
                }
              >
                {user?.two_fa_enabled ? "Enabled" : "Disabled"}
              </span>
            </p>
          </div>
          <Button
            onClick={user?.two_fa_enabled ? handleDisable : handleEnableStart}
            disabled={isLoading}
            variant={user?.two_fa_enabled ? "outline" : "default"}
            className="px-4 py-2 text-sm flex-shrink-0"
          >
            {isLoading
              ? "Loading..."
              : user?.two_fa_enabled
              ? "Disable"
              : "Enable"}
          </Button>
        </div>
      </div>
      <Dialog open={showEnableModal} onOpenChange={setShowEnableModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
          </DialogHeader>
          {step === "qr" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your authenticator app (Google
                Authenticator, Authy, etc.)
              </p>
              {qrUrl && (
                <div className="flex justify-center p-4 bg-background border border-border rounded-sm">
                  <QRCodeSVG value={qrUrl} size={256} />
                </div>
              )}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowEnableModal(false);
                    setQrUrl("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => setStep("verify")}>Next</Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (totpCode.length === 6 && !isLoading) {
                  handleVerify();
                }
              }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code from your authenticator app
              </p>
              <input
                type="text"
                value={totpCode}
                onChange={(e) =>
                  setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="w-full border border-border rounded-sm px-4 py-2.5 text-center text-2xl tracking-widest bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={6}
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("qr")}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={totpCode.length !== 6 || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
