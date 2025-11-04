// Validation utilities for forms and user input

// Email validation regex (RFC 5322 simplified)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Full name requirements
const MIN_WORDS_IN_NAME = 2;
const MIN_WORD_LENGTH = 2;

// Password requirements
const MIN_PASSWORD_LENGTH = 8;

// Signup token requirements
const SIGNUP_TOKEN_LENGTH = 6;

/** Check if email format is valid */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
};

/** Check if password meets security requirements */
export const isValidPassword = (
  password: string,
  minLength: number = MIN_PASSWORD_LENGTH
): boolean => {
  return password.length >= minLength;
};

/** Check if full name has at least 2 words with minimum length */
export const isValidFullName = (fullName: string): boolean => {
  const trimmed = fullName.trim();
  if (!trimmed) return false;

  const words = trimmed.split(/\s+/).filter((word) => word.length > 0);

  if (words.length < MIN_WORDS_IN_NAME) return false;

  for (const word of words) {
    if (word.length < MIN_WORD_LENGTH) return false;
  }

  return true;
};

/** Check if two passwords match */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/** Check if required field is not empty */
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/** Check if signup token is valid 6-digit code */
export const isValid6DigitCode = (code: string): boolean => {
  return code.length === SIGNUP_TOKEN_LENGTH && /^\d{6}$/.test(code);
};

/** Normalize email to lowercase and trimmed */
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/** Normalize full name by trimming whitespace */
export const normalizeFullName = (fullName: string): string => {
  return fullName.trim();
};

// Form validation error types
export type ValidationErrors = Record<string, string>;

// Common validation error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Invalid email address format",
  INVALID_FULL_NAME:
    "Full name must contain at least 2 words with minimum 2 characters each",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters long",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  INVALID_CODE: "Verification code must be a 6-digit number",
} as const;
