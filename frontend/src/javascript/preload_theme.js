try {
  const saved = localStorage.getItem("selected_theme");
  const root = document.documentElement;

  if (saved) {
    // Temporary default values — matches your DB keys
    const themeData = JSON.parse(localStorage.getItem("theme_data_" + saved) || "{}");

    if (themeData && Object.keys(themeData).length > 0) {
      for (const [key, value] of Object.entries(themeData)) {
        root.style.setProperty(`--${key}`, value);
      }

      if (saved === "dark" || saved === "custom") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }
} catch (e) {
  console.error("Theme preload error:", e);
}
