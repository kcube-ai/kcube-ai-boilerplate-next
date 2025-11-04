export const SPACING = {
  // Sidebar & Navigation
  SIDEBAR_PADDING: "p-4",
  SIDEBAR_ITEM_PADDING: "px-2 py-2",
  SIDEBAR_CONTENT_PADDING: "px-4 py-6",
  SIDEBAR_WIDTH: "w-sidebar", // 20.8%
  SIDEBAR_MOBILE_WIDTH: "w-mobile-sidebar", // 250px

  // Header & Layout
  HEADER_HEIGHT: "h-16",
  MAIN_PADDING: "p-4",

  // Navigation Items
  NAV_ITEM_INDENT: "ml-6",
  NAV_ITEM_GAP: "gap-2",

  // Icons & Visual Elements
  ICON_SIZE_SM: "h-4 w-4",
  ICON_SIZE: "h-5 w-5",
  ICON_SIZE_LG: "h-6 w-6",
  CHEVRON_SIZE: "h-4 w-4",
  AVATAR_SIZE: "h-8 w-8",

  // Chat Interface
  CHAT_BUBBLE_PADDING: "px-4 py-3",
  CHAT_INPUT_PADDING: "p-2.5 px-5",
  CHAT_CONTAINER_PADDING: "p-4",
  CHAT_MESSAGE_GAP: "space-y-4",

  // Cards & Components
  CARD_PADDING: "p-6",
  CARD_PADDING_SM: "p-4",
  MODAL_PADDING: "p-6",

  // Forms
  INPUT_PADDING: "px-4 py-2.5",
  BUTTON_PADDING: "px-4 py-3.5",
  BUTTON_PADDING_SM: "px-4 py-2",
} as const;

export const COLORS = {
  // Brand Colors  
  PRIMARY: "sample-blue-500",
  PRIMARY_DARK: "sample-blue-600",

  // Backgrounds
  SIDEBAR_BG: "sample-gray-50",
  CARD_BG: "white",
  MUTED_BG: "sample-gray-100",
  ACTIVE_BG: "sample-gray-200",

  // Text Colors
  PRIMARY_TEXT: "sample-gray-600",
  SECONDARY_TEXT: "sample-gray-300",
  MUTED_TEXT: "sample-gray-300",

  // Border Colors
  BORDER: "border",
  BORDER_LIGHT: "border-sample-gray-100",

  // Status Colors
  SUCCESS: "green-500",
  ERROR: "red-500",
  WARNING: "yellow-500",
  INFO: "blue-500",
} as const;

export const DIMENSIONS = {
  // Layout Dimensions
  SIDEBAR_WIDTH_DESKTOP: "20.8%",
  MAIN_WIDTH_DESKTOP: "79.2%",
  MOBILE_SIDEBAR_WIDTH: "250px",

  // Component Heights
  FILE_DROP_HEIGHT: "h-file-drop", // 250px
  CHAT_HISTORY_HEIGHT: "h-chat-history", // 570px
  DOCUMENT_CHAT_HEIGHT: "h-document-chat", // 285px

  // Max Widths
  CHAT_MESSAGE_MAX_WIDTH: "max-w-chat-message", // 32rem
  CONTAINER_MAX_WIDTH: "max-w-7xl",

  // Border Radius
  RADIUS_SM: "rounded-sm", // 8px
  RADIUS: "rounded-lg", // 16px
  RADIUS_FULL: "rounded-3xl", // Chat bubbles
  RADIUS_FILE_DROP: "rounded-xl", // 20px
} as const;

export const ANIMATIONS = {
  // Transitions
  TRANSITION_FAST: "transition-colors duration-200",
  TRANSITION_DEFAULT: "transition-all duration-200",
  TRANSITION_SLOW: "transition-all duration-300",

  // Animations
  FADE_IN: "animate-fade-in",
  SLIDE_IN: "animate-slide-in",
  PULSE: "animate-pulse",
  TYPING_DOTS: "animate-pulse-dot",

  // Hover Effects
  HOVER_SCALE: "hover:scale-102",
  HOVER_SHADOW: "hover:shadow-sample",
} as const;

export const SAMPLE_LOGO = {
  // SVG Logo Properties
  SVG_SIZE: 32,
  SVG_SIZE_SM: 24,
  SVG_SIZE_LG: 40,

  // Brand Colors for Logo
  MAIN_COLOR: "#059FFF",
  ACCENT_COLOR: "#0589e6",

  // Logo Positions (if using geometric logo)
  MAIN_CIRCLE: { cx: 16, cy: 16, r: 10 },
  ACCENT_CIRCLE: { cx: 24, cy: 8, r: 6 },
  DOT: { cx: 12, cy: 24, r: 3 },
} as const;

export const BREAKPOINTS = {
  // Tailwind Breakpoints
  SM: "640px",   // sm:
  MD: "768px",   // md:
  LG: "1024px",  // lg: (sidebar switches here)
  XL: "1280px",  // xl:
  "2XL": "1536px", // 2xl:

  // Custom Sample Breakpoints
  MOBILE_SIDEBAR_BREAKPOINT: "lg", // When sidebar becomes mobile
  DESKTOP_LAYOUT_BREAKPOINT: "lg", // When layout switches to desktop mode
} as const;

export const Z_INDEX = {
  // Z-Index Scale
  DROPDOWN: "z-10",
  STICKY: "z-20",
  FIXED: "z-30",
  MODAL_BACKDROP: "z-40",
  MODAL: "z-50",
  POPOVER: "z-50",
  TOOLTIP: "z-60",
  MOBILE_SIDEBAR: "z-1000",
  TOAST: "z-50",
  LOADER: "z-9999",
} as const;

// Landing page specific styles
export const LANDING_STYLES = {
  HERO_GRADIENT: "bg-gradient-to-r from-background via-blue-50 to-background dark:from-background dark:via-blue-950 dark:to-background",
  NAV_LINK: "text-muted-foreground hover:text-primary transition-colors px-3 py-2 text-sm font-medium",
  NAV_LINK_MOBILE: "text-muted-foreground hover:text-primary transition-colors block px-3 py-2 text-sm font-medium",
} as const;

export const COMPONENT_CLASSES = {
  // Button Classes
  BUTTON_PRIMARY: "btn-primary",
  BUTTON_SECONDARY: "btn-secondary",
  BUTTON_GHOST: "btn-ghost",

  // Input Classes
  INPUT_PRIMARY: "input-primary",
  INPUT_SEARCH: "input-search",
  CHAT_INPUT: "chat-input",

  // Card Classes  
  CARD_PRIMARY: "card-primary",
  CARD_HOVER: "card-hover",

  // Chat Classes
  CHAT_BUBBLE_USER: "chat-bubble-user",
  CHAT_BUBBLE_AI: "chat-bubble-ai",
  CHAT_CONTAINER: "chat-container",

  // Navigation Classes
  NAV_ITEM: "nav-item",
  NAV_ITEM_ACTIVE: "nav-item nav-item-active",

  // Layout Classes
  SIDEBAR_CONTAINER: "sidebar-container",
  MAIN_CONTENT: "main-content",

  // File Upload
  FILE_DROP_ZONE: "file-drop-zone",
  FILE_INPUT: "file-input",

  // Utility Classes
  SCROLL_CUSTOM: "scroll-custom",
  TEXT_GRADIENT: "text-gradient",
  GLASS_EFFECT: "glass-effect",
} as const;

// Type exports for better TypeScript support
export type SpacingKeys = keyof typeof SPACING;
export type ColorKeys = keyof typeof COLORS;
export type DimensionKeys = keyof typeof DIMENSIONS;
export type AnimationKeys = keyof typeof ANIMATIONS;