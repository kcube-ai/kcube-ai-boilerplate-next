"use client";

import { useState } from "react";

import { BookDemoService } from "@/app/client";
import { handleError } from "@/lib/error";
import { AuthButton } from "@/components/auth/auth-button";

interface BookDemoFormProps {
  onSuccess: (email: string) => void;
}

export function BookDemoForm({ onSuccess }: BookDemoFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_name: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await BookDemoService.createApiV1BookDemoPost({
        requestBody: {
          name: formData.name,
          email: formData.email,
          company_name: formData.company_name,
          message: formData.message || undefined,
        },
      });

      onSuccess(formData.email);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => handleChange("name")(e.target.value)}
          required
          maxLength={300}
          className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john@company.com"
          value={formData.email}
          onChange={(e) => handleChange("email")(e.target.value)}
          required
          maxLength={255}
          className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="company_name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Company Name
        </label>
        <input
          id="company_name"
          name="company_name"
          type="text"
          placeholder="Acme Inc."
          value={formData.company_name}
          onChange={(e) => handleChange("company_name")(e.target.value)}
          required
          maxLength={300}
          className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Message (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Tell us about your needs..."
          value={formData.message}
          onChange={(e) => handleChange("message")(e.target.value)}
          maxLength={500}
          rows={4}
          className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {formData.message.length}/500 characters
        </p>
      </div>

      <AuthButton loading={loading}>Request Demo</AuthButton>
    </form>
  );
}
