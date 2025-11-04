"use client";

import MDEditor from "@uiw/react-md-editor";

export const MarkdownEditor = ({
  value,
  setValue,
  disabled = false,
  defaultHeight = 230,
  defaultPreview = "edit",
}: {
  value: string;
  setValue?: (val: string) => void;
  defaultHeight?: number;
  disabled?: boolean;
  defaultPreview?: "edit" | "preview";
}) => {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(v) => {
          if (typeof v === "string") !disabled && setValue?.(v);
        }}
        preview={defaultPreview}
        height={defaultHeight}
      />
    </div>
  );
};
