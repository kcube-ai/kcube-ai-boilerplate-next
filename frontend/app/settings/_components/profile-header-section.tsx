"use client";

import { Calendar, Camera } from "lucide-react";
import { useEffect, useState } from "react";

import { UsersService } from "@/app/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/contexts/user-context";
import { formatDate, formatDateFull } from "@/lib/format";
import { getInitials } from "@/lib/format";
import { handleError } from "@/lib/error";
import {
  ERROR_MESSAGES,
  isValidFullName,
  normalizeFullName,
} from "@/lib/validation";

export function ProfileHeaderSection() {
  const { user, refreshUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedImageData, setUploadedImageData] = useState<string | null>(
    null
  );
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);

  useEffect(() => {
    setFullName(user?.full_name || "");
  }, [user?.full_name]);

  // Initialize preview with existing profile picture when modal opens
  const handleOpenModal = () => {
    setPreviewImage(user?.profile_picture || null);
    setShouldRemoveImage(false);
    setIsOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      // Create preview and store base64 data
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setPreviewImage(base64Data);
        setUploadedImageData(base64Data);
        setShouldRemoveImage(false);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setUploadedImageData(null);
    setShouldRemoveImage(true);
  };

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

      // Update name if changed
      if (fullName !== user?.full_name) {
        await UsersService.updateApiV1UserPut({
          requestBody: { full_name: normalizeFullName(fullName) },
        });
      }

      // Handle profile picture changes
      if (uploadedImageData) {
        // User uploaded a new image
        await UsersService.updateProfilePictureApiV1UserProfilePicturePost({
          requestBody: { profile_picture: uploadedImageData },
        });
      } else if (shouldRemoveImage && user?.profile_picture) {
        // User explicitly clicked "Remove photo"
        await UsersService.removeProfilePictureApiV1UserProfilePictureDelete();
      }

      await refreshUser();
      setIsOpen(false);
      setPreviewImage(null);
      setUploadedImageData(null);
      setShouldRemoveImage(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.full_name || "");
    setError("");
    setPreviewImage(null);
    setUploadedImageData(null);
    setShouldRemoveImage(false);
    setIsOpen(false);
  };

  const displayImage = shouldRemoveImage
    ? null
    : previewImage || user?.profile_picture;
  const initials = getInitials(user?.full_name || "");

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            {displayImage ? (
              <img
                src={displayImage}
                alt={user?.full_name}
                className="h-24 w-24 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">
                  {initials}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold text-foreground truncate">
              {user?.full_name}
            </h2>
            <p className="text-base text-foreground/80 mt-1.5 font-medium">
              {user?.email}
            </p>
            {user?.signup_verified && (
              <div
                className="inline-flex items-center gap-2 mt-2.5 px-2.5 py-1 bg-secondary/80 rounded-md border border-border"
                title={formatDateFull(user.signup_verified)}
              >
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Joined {formatDate(user.signup_verified, false)}
                </span>
              </div>
            )}
          </div>

          {/* Action */}
          <Button onClick={handleOpenModal} className="px-4 py-2 text-sm">
            Edit Profile
          </Button>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center">
                    <span className="text-4xl font-semibold text-primary">
                      {initials}
                    </span>
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg border-2 border-card"
                >
                  <Camera className="h-5 w-5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground text-center">
                  Click the camera icon to upload a new photo (Max 5MB)
                </p>
                {displayImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full border rounded-sm px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  error ? "border-red-500" : "border-border"
                }`}
                disabled={isLoading}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email}
                className="w-full border border-border rounded-sm px-4 py-2.5 text-sm bg-background text-foreground opacity-60"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>
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
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
