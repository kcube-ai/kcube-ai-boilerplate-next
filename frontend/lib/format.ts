/**
 * Formatting utilities.
 * Functions for formatting dates, strings, and other data for display.
 */

/**
 * Parse UTC datetime string from backend.
 * Backend returns UTC times without 'Z' suffix, so we append it.
 */
const parseUTCDate = (dateString: string): Date => {
  // If the string doesn't end with 'Z', it's UTC from our backend
  const utcString = dateString.endsWith("Z") ? dateString : dateString + "Z";
  return new Date(utcString);
};

/**
 * Format date string for display.
 * Converts UTC time to user's local timezone.
 * Shows time by default, hides year if current year.
 */
export const formatDate = (
  dateString: string,
  includeTime: boolean = true
): string => {
  const date = parseUTCDate(dateString);
  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Intl.DateTimeFormat("en-US", {
    year: isCurrentYear ? undefined : "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime && { hour: "numeric", minute: "numeric" }),
    timeZone: userTimeZone,
  }).format(date);
};

/**
 * Format date string as full datetime for tooltips/titles.
 * Converts UTC time to user's local timezone.
 * Shows full date with weekday, time, and timezone.
 */
export const formatDateFull = (dateString: string): string => {
  const date = parseUTCDate(dateString);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
    timeZone: userTimeZone,
  }).format(date);
};

/**
 * Get initials from user name or email.
 * Returns 2-letter initials from name, or from email if no name.
 */
export const getInitials = (name?: string | null, email?: string): string => {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
    return (first + last).toUpperCase();
  }

  if (email) {
    const local = email.split("@")[0] ?? "";
    return local.slice(0, 2).toUpperCase();
  }

  return "U";
};

/**
 * Check if string is a valid UUID (with or without hyphens).
 */
export const isValidUUID = (uuid: string): boolean => {
  const withHyphens =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const withoutHyphens = /^[0-9a-f]{32}$/i;

  return withHyphens.test(uuid) || withoutHyphens.test(uuid);
};

/**
 * Format current date for display.
 * Returns format: "Monday, December 2"
 */
export const formatCurrentDate = (): string => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: userTimeZone,
  }).format(new Date());
};

/**
 * Format current time for display.
 * Returns format: "2:45:30 PM"
 */
export const formatCurrentTime = (): string => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone: userTimeZone,
  }).format(new Date());
};

/**
 * Get time-based greeting.
 * Returns "morning", "afternoon", or "evening" based on current hour.
 */
export const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
};

/**
 * Format file size in bytes to human-readable format.
 * Returns format like "1.5 MB", "256 KB", "2.3 GB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
