export const ALLOWED_FILE_TYPES = [
  ".pdf",
  ".xlsx",
  ".xls",
  ".pptx",
  ".ppt",
  ".txt",
];

export const truncateFilename = (filename: string, maxLength: number = 40) => {
  if (filename.length <= maxLength) return filename;
  const extension = filename.split(".").pop();
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf("."));
  const truncatedName = nameWithoutExt.substring(
    0,
    maxLength - extension!.length - 4
  );
  return `${truncatedName}...${extension}`;
};
