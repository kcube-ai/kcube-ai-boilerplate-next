"use client";

import { useState } from "react";

import { UsersService } from "@/app/client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { handleError } from "@/lib/error";
import {
  ERROR_MESSAGES,
  isValidFullName,
  normalizeFullName,
} from "@/lib/validation";

export function ProfileSection() {
  const { user, refreshUser } = useUser();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError(ERROR_MESSAGES.REQUIRED_FIELD);
      return;
    }

    if (!isValidFullName(fullName)) {
      setError(ERROR_MESSAGES.INVALID_FULL_NAME);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await UsersService.updateApiV1UserPut({
        requestBody: { full_name: normalizeFullName(fullName) },
      });
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.full_name || "");
    setError("");
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Profile Information
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full border rounded-sm px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
              !isEditing
                ? "opacity-60 border-border"
                : error
                ? "border-red-500"
                : "border-border"
            }`}
            disabled={!isEditing}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <input
            type="email"
            defaultValue={user?.email}
            className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background text-foreground opacity-60"
            disabled
          />
          <p className="text-xs text-muted-foreground mt-1">
            Email cannot be changed
          </p>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm"
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 text-sm"
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
