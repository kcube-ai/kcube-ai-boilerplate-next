import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Theme } from "../types/site_settings";

async function fetchThemes(): Promise<Theme[]> {
  const res = await fetch("http://localhost:8000/api/settings/themes");
  if (!res.ok) throw new Error("Failed to fetch themes");
  return res.json();
}

export function useThemes() {
  const { data: themes = [], isLoading, error } = useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: fetchThemes,
    staleTime: Infinity,
  });

  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);

  useEffect(() => {
    if (themes.length === 0) return;

    const saved = localStorage.getItem("selected_theme");
    const selected = themes.find((t) => t.theme === saved);
    const defaultTheme = selected || themes.find((t) => t.is_default) || themes[0];

    setCurrentTheme(defaultTheme);
    applyTheme(defaultTheme);
  }, [themes]);

  function applyTheme(theme: Theme) {
    const root = document.documentElement;

    // Toggle Tailwind dark class
    if (theme.theme === "dark" || theme.theme === "custom") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply CSS variables
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== "theme" && key !== "is_default") {
        root.style.setProperty(`--${key}`, value);
      }
    });

    // Save full theme locally for instant load next time
    localStorage.setItem("theme_data_" + theme.theme, JSON.stringify(theme));
  }

  function switchTheme(name: string) {
    const newTheme = themes.find((t) => t.theme === name);
    if (newTheme) {
      setCurrentTheme(newTheme);
      applyTheme(newTheme);
      localStorage.setItem("selected_theme", name);
    }
  }

  return {
    themes,
    currentTheme,
    switchTheme,
    isLoading,
    error,
  };
}
