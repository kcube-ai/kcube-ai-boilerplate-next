import { useEffect } from "react";

/**
 * Hook to dynamically update the page title.
 * Use this in client components to ensure title updates on client-side navigation.
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
