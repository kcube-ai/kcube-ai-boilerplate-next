# Sample AI - Frontend Design System

## Overview

This document defines the complete design system for the Sample AI frontend application. All components, pages, and features **MUST** follow these guidelines to ensure consistency and professionalism across the entire application.

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Animations & Transitions](#animations--transitions)
7. [Icons](#icons)
8. [Shadows & Elevation](#shadows--elevation)
9. [Responsive Design](#responsive-design)
10. [Usage Guidelines](#usage-guidelines)

---

## Design Principles

### Core Values
- **Consistency**: Every component follows the same design patterns
- **Professionalism**: Clean, minimal, and business-focused aesthetic
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized for speed and efficiency
- **Scalability**: Design system that grows with the product

### Visual Style
- Modern and clean interface
- Subtle shadows and depth
- Generous whitespace
- Clear visual hierarchy
- Professional color palette

---

## Color System

### Dark/Light Mode Theming

**Sample AI supports both light and dark modes** using `next-themes` and CSS variables. All colors automatically adapt to the selected theme.

#### Theme Provider Setup

The theme system is initialized in `/app/layout.tsx`:

```tsx
import { ThemeProvider } from "@/components/theme-provider";

<ThemeProvider
  attribute="class"
  defaultTheme="light"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

#### CSS Variables (Defined in `/app/globals.css`)

Colors are defined as HSL values in CSS variables that change based on theme:

```css
:root {
  /* Light mode */
  --background: 0 0% 100%;        /* white */
  --foreground: 0 0% 0%;          /* black */
  --card: 0 0% 100%;              /* white */
  --card-foreground: 0 0% 0%;     /* black */
  --primary: 201 100% 50%;        /* #059FFF sample-blue */
  --primary-foreground: 0 0% 100%; /* white */
  --muted: 0 0% 96%;              /* #F4F4F4 */
  --muted-foreground: 216 6% 39%; /* #5F6368 */
  --accent: 0 0% 93%;             /* #ECECEC */
  --border: 0 0% 0% / 0.1;        /* rgba(0,0,0,0.1) */
}

.dark {
  /* Dark mode */
  --background: 0 0% 7%;          /* #121212 */
  --foreground: 0 0% 95%;         /* #F2F2F2 */
  --card: 0 0% 11%;               /* #1C1C1C */
  --card-foreground: 0 0% 95%;    /* #F2F2F2 */
  --primary: 201 100% 50%;        /* #059FFF stays same */
  --primary-foreground: 0 0% 100%; /* white */
  --muted: 0 0% 15%;              /* #262626 */
  --muted-foreground: 0 0% 60%;   /* #999999 */
  --accent: 0 0% 20%;             /* #333333 */
  --border: 0 0% 100% / 0.1;      /* rgba(255,255,255,0.1) */
}
```

### Semantic Color Classes (Theme-Aware)

**ALWAYS use these semantic classes instead of hard-coded colors:**

#### Background Colors
```tsx
bg-background       // Main page background (white → dark gray)
bg-card             // Card/panel background (white → darker gray)
bg-muted            // Muted sections (#F4F4F4 → #262626)
bg-accent           // Accent backgrounds (#ECECEC → #333333)
bg-primary          // Primary brand color (stays #059FFF in both modes)
```

#### Text Colors
```tsx
text-foreground           // Primary text (black → light gray)
text-muted-foreground     // Secondary text (#5F6368 → #999999)
text-primary              // Primary brand color text
text-primary-foreground   // Text on primary bg (white in both)
text-card-foreground      // Text on card bg
```

#### Border Colors
```tsx
border-border       // Standard borders (adapts to theme)
border-input        // Input field borders (adapts to theme)
```

#### Status Colors
```tsx
bg-destructive              // Error backgrounds
text-destructive-foreground // Text on destructive bg
```

### Legacy Brand Colors (For Reference)

These are still available but prefer semantic classes for theme support:

#### Primary Color - Sample Blue
```typescript
sample-blue-DEFAULT: '#059FFF'  // Primary brand color
sample-blue-dark: '#0589e6'     // Hover/active states
sample-blue-50: '#f0f9ff'       // Light backgrounds
sample-blue-100: '#e0f2fe'      // Subtle backgrounds
sample-blue-500: '#059FFF'      // Same as DEFAULT
sample-blue-600: '#0589e6'      // Same as dark
```

#### Grayscale
```typescript
sample-gray-50: '#FAFAFA'   // Sidebar, light backgrounds
sample-gray-100: '#F4F4F4'  // Muted backgrounds, cards
sample-gray-200: '#ECECEC'  // Active states, borders
sample-gray-300: '#5F6368'  // Secondary text, icons
sample-gray-400: '#6D7175'  // Disabled states
sample-gray-500: '#202123'  // Primary text
sample-gray-600: '#000000'  // Headings, emphasis
```

### Theme-Aware Color Usage

#### ✅ DO: Use Semantic Classes

```tsx
// Backgrounds
<div className="bg-background">        // ✅ Auto adapts to theme
<div className="bg-card">              // ✅ Auto adapts to theme
<div className="bg-muted">             // ✅ Auto adapts to theme

// Text
<p className="text-foreground">        // ✅ Auto adapts to theme
<p className="text-muted-foreground">  // ✅ Auto adapts to theme

// Borders
<div className="border border-border"> // ✅ Auto adapts to theme

// Primary color (stays same in both modes)
<button className="bg-primary text-primary-foreground"> // ✅ Good
```

#### ❌ DON'T: Use Hard-Coded Colors

```tsx
// These won't adapt to dark mode
<div className="bg-white">             // ❌ Hard-coded
<div className="bg-gray-100">          // ❌ Hard-coded
<div className="text-black">           // ❌ Hard-coded
<div className="text-gray-600">        // ❌ Hard-coded
<div className="border-gray-200">      // ❌ Hard-coded
```

#### Using Theme in Components

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  );
}
```

### Theme Selection Component

Users can select their theme in Settings (`/settings`):

```tsx
// Location: /app/settings/_components/theme-section.tsx
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor }
];

// User's preference is stored in localStorage
```

### Special Cases

#### Landing Page Footer
The footer intentionally uses `bg-black` in both themes for design consistency:

```tsx
<footer className="bg-black text-white">
  {/* Always dark regardless of theme */}
</footer>
```

#### Modal Overlays
Modal backdrops use semi-transparent black in both themes:

```tsx
<div className="bg-black/50">  {/* Intentional - works in both modes */}
  {/* Modal content */}
</div>
```

### Color Usage Constants

Import from `/constants/ui.ts`:

```typescript
import { COLORS } from "@/constants/ui";

// Examples
className={`bg-${COLORS.PRIMARY}`}           // bg-sample-blue-500
className={`text-${COLORS.SECONDARY_TEXT}`}  // text-sample-gray-300
```

---

## Typography

### Font Family

**Primary Font: Inter**
- Loaded from: `https://rsms.me/inter/inter.css`
- Fallback: `ui-sans-serif, system-ui, sans-serif`

```css
font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
```

### Font Sizes & Weights

All typography is predefined in `tailwind.config.ts`:

```typescript
// Size    Font Size  Line Height  Font Weight
text-xs    10px       12px         400
text-sm    12px       16px         300
text-base  14px       16px         400
text-lg    16px       24px         400
text-xl    20px       24px         600
text-2xl   32px       40px         600
text-3xl   40px       54px         600
```

### Typography Hierarchy

#### Headings
```tsx
// H1 - Page Titles
<h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
  Main Page Title
</h1>

// H2 - Section Titles
<h2 className="text-3xl lg:text-4xl font-bold text-foreground">
  Section Title
</h2>

// H3 - Subsection Titles
<h3 className="text-xl font-semibold text-foreground">
  Subsection Title
</h3>
```

#### Body Text
```tsx
// Large body text (landing pages, descriptions)
<p className="text-lg text-muted-foreground leading-relaxed">
  Large descriptive text
</p>

// Regular body text
<p className="text-base text-foreground">
  Regular paragraph text
</p>

// Small text (captions, labels)
<p className="text-sm text-muted-foreground">
  Small supporting text
</p>
```

#### Special Text
```tsx
// Gradient text (for emphasis)
<span className={COMPONENT_CLASSES.TEXT_GRADIENT}>
  Powerful AI
</span>

// Result: gradient from black to gray
```

---

## Spacing & Layout

### Spacing Scale

Use Tailwind's spacing scale consistently:

```typescript
// Padding/Margin values
p-2    8px
p-3    12px
p-4    16px
p-6    24px
p-8    32px
p-12   48px
p-16   64px

// Custom spacing (defined in tailwind.config.ts)
space-4.5    18px
space-18     72px
space-22     88px
```

### Section Padding

**Standard section padding:**
```tsx
<section className="py-16 lg:py-20">
  {/* Content */}
</section>
```

**With background:**
```tsx
<section className="py-16 lg:py-20 bg-sample-gray-50">
  {/* Content */}
</section>
```

### Container Widths

```tsx
// Standard container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Narrower container (FAQs, videos)
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Grid Layouts

```tsx
// 2-column layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  {/* Content */}
</div>

// 4-column feature grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Features */}
</div>
```

### Spacing Constants

Import from `/constants/ui.ts`:

```typescript
import { SPACING } from "@/constants/ui";

SPACING.SIDEBAR_PADDING        // p-4
SPACING.CARD_PADDING           // p-6
SPACING.CARD_PADDING_SM        // p-4
SPACING.INPUT_PADDING          // px-4 py-2.5
SPACING.BUTTON_PADDING         // px-4 py-3.5
SPACING.ICON_SIZE              // h-5 w-5
SPACING.ICON_SIZE_SM           // h-4 w-4
SPACING.ICON_SIZE_LG           // h-6 w-6
```

---

## Components

### Buttons

**Import component classes:**
```typescript
import { COMPONENT_CLASSES } from "@/constants/ui";
```

#### Primary Button
```tsx
<Button className={COMPONENT_CLASSES.BUTTON_PRIMARY}>
  Primary Action
</Button>

// Renders with:
// - bg-sample-blue-500
// - text-white
// - px-4 py-3.5
// - rounded-sm (8px)
// - hover:bg-sample-blue-600
// - focus ring
```

#### Secondary Button
```tsx
<Button variant="outline" className={COMPONENT_CLASSES.BUTTON_SECONDARY}>
  Secondary Action
</Button>

// Renders with:
// - bg-white
// - text-sample-gray-300
// - border border-border
// - px-4 py-2
// - rounded-sm (8px)
```

#### Ghost Button
```tsx
<Button variant="ghost" className={COMPONENT_CLASSES.BUTTON_GHOST}>
  Ghost Action
</Button>

// Renders with:
// - text-sample-gray-300
// - hover:bg-sample-gray-50
// - px-2 py-2
```

#### Button Sizes
```tsx
<Button size="sm">Small</Button>      // Compact size
<Button size="default">Default</Button>
<Button size="lg">Large</Button>      // Landing pages, CTAs
```

### Cards

#### Standard Card
```tsx
<div className={COMPONENT_CLASSES.CARD_PRIMARY}>
  {/* Content */}
</div>

// Renders with:
// - bg-white
// - border border-border
// - rounded-lg (16px)
// - p-6
// - shadow-sample-sm
```

#### Hoverable Card
```tsx
<div className={COMPONENT_CLASSES.CARD_HOVER}>
  {/* Content */}
</div>

// Same as CARD_PRIMARY plus:
// - transition-all duration-200
// - hover:shadow-sample
```

#### Card with Shadcn/UI
```tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";

<Card className={`border-border ${ANIMATIONS.HOVER_SHADOW} ${ANIMATIONS.TRANSITION_DEFAULT}`}>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

### Input Fields

#### Primary Input
```tsx
<input className={COMPONENT_CLASSES.INPUT_PRIMARY} placeholder="Enter text" />

// Renders with:
// - border border-border
// - rounded-sm (8px)
// - px-4 py-2.5
// - text-sm
// - bg-white
// - focus ring
```

#### Search Input
```tsx
<input className={COMPONENT_CLASSES.INPUT_SEARCH} placeholder="Search..." />

// Same as INPUT_PRIMARY plus:
// - bg-sample-gray-50
// - rounded-2xl
```

### Chat Components

#### User Message Bubble
```tsx
<div className={COMPONENT_CLASSES.CHAT_BUBBLE_USER}>
  User message text
</div>

// Renders with:
// - bg-sample-blue-500
// - text-white
// - px-4 py-3
// - rounded-3xl
// - max-w-chat-message (32rem)
// - ml-auto
```

#### AI Message Bubble
```tsx
<div className={COMPONENT_CLASSES.CHAT_BUBBLE_AI}>
  AI response text
</div>

// Renders with:
// - bg-sample-gray-100
// - text-black
// - px-4 py-3
// - rounded-3xl
// - max-w-chat-message (32rem)
```

#### Chat Input
```tsx
<textarea className={COMPONENT_CLASSES.CHAT_INPUT} placeholder="Ask a question..." />

// Renders with:
// - w-full
// - border-none
// - bg-white
// - p-2.5 px-5
// - rounded-t-lg
// - border-b border-border
```

### Navigation

#### Navigation Item
```tsx
// Default state
<div className={COMPONENT_CLASSES.NAV_ITEM}>
  <Icon className={SPACING.ICON_SIZE} />
  <span>Item Label</span>
</div>

// Active state
<div className={COMPONENT_CLASSES.NAV_ITEM_ACTIVE}>
  <Icon className={SPACING.ICON_SIZE} />
  <span>Active Item</span>
</div>
```

#### Landing Page Navigation Links
```tsx
import { LANDING_STYLES } from "@/constants/ui";

// Desktop link
<Link href="/path" className={LANDING_STYLES.NAV_LINK}>
  Link Text
</Link>

// Mobile link
<Link href="/path" className={LANDING_STYLES.NAV_LINK_MOBILE}>
  Link Text
</Link>
```

### File Upload

```tsx
<div className={COMPONENT_CLASSES.FILE_DROP_ZONE}>
  <input type="file" className={COMPONENT_CLASSES.FILE_INPUT} />
  {/* Drop zone content */}
</div>
```

---

## Animations & Transitions

### Animation Constants

Import from `/constants/ui.ts`:

```typescript
import { ANIMATIONS } from "@/constants/ui";

ANIMATIONS.TRANSITION_FAST      // transition-colors duration-200
ANIMATIONS.TRANSITION_DEFAULT   // transition-all duration-200
ANIMATIONS.TRANSITION_SLOW      // transition-all duration-300

ANIMATIONS.FADE_IN              // animate-fade-in
ANIMATIONS.SLIDE_IN             // animate-slide-in
ANIMATIONS.PULSE                // animate-pulse
ANIMATIONS.TYPING_DOTS          // animate-pulse-dot

ANIMATIONS.HOVER_SHADOW         // hover:shadow-sample
```

### Usage Examples

```tsx
// Hover shadow on cards
<Card className={ANIMATIONS.HOVER_SHADOW}>

// Smooth transitions on buttons
<Button className={ANIMATIONS.TRANSITION_DEFAULT}>

// Fade in animations
<div className={ANIMATIONS.FADE_IN}>

// Loading dots
<span className={ANIMATIONS.TYPING_DOTS}>•</span>
```

### Custom Animations

Defined in `tailwind.config.ts`:

```typescript
keyframes: {
  "fade-in": {
    from: { opacity: "0", transform: "translateY(10px)" },
    to: { opacity: "1", transform: "translateY(0)" }
  },
  "slide-in": {
    from: { opacity: "0", transform: "translateX(-10px)" },
    to: { opacity: "1", transform: "translateX(0)" }
  },
  "pulse-dot": {
    "0%, 100%": { opacity: "0.4" },
    "50%": { opacity: "1" }
  }
}
```

### Reduced Motion

Accessibility support in `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Icons

### Icon Library

**Primary: Lucide React**
```tsx
import { Search, TrendingUp, FileText, Brain } from "lucide-react";
```

### Icon Sizes

```tsx
import { SPACING } from "@/constants/ui";

// Small icons (16px)
<Icon className={SPACING.ICON_SIZE_SM} />

// Default icons (20px)
<Icon className={SPACING.ICON_SIZE} />

// Large icons (24px)
<Icon className={SPACING.ICON_SIZE_LG} />

// Custom sizes
<Icon className="w-8 h-8" />    // 32px
<Icon className="w-12 h-12" />  // 48px
<Icon className="w-16 h-16" />  // 64px
```

### Icon Colors

```tsx
// Primary color
<Icon className="text-sample-blue" />

// Gray scale
<Icon className="text-sample-gray-300" />
<Icon className="text-sample-gray-400" />

// Semantic colors
<Icon className="text-white" />
<Icon className="text-foreground" />
<Icon className="text-muted-foreground" />
```

---

## Shadows & Elevation

### Shadow System

Defined in `tailwind.config.ts`:

```typescript
boxShadow: {
  'sample': '0 10px 20px rgba(0,0,0,.1)',      // Large shadow
  'sample-sm': '0 2px 4px rgba(0,0,0,.05)',    // Small shadow
}
```

### Usage

```tsx
// Large shadow (cards, modals)
<div className="shadow-sample">

// Small shadow (buttons, small cards, icons)
<div className="shadow-sample-sm">

// Hover shadow effect
<div className={ANIMATIONS.HOVER_SHADOW}>
// Transitions from no shadow to shadow-sample on hover
```

### Elevation Hierarchy

1. **Flat** (0): Default backgrounds, no shadow
2. **Raised** (1): `shadow-sample-sm` - Buttons, small cards
3. **Elevated** (2): `shadow-sample` - Cards, dropdowns, modals
4. **Floating** (3): `shadow-sample` + larger - Dialogs, tooltips

---

## Responsive Design

### Breakpoints

```typescript
sm: "640px"    // Small tablets
md: "768px"    // Tablets
lg: "1024px"   // Laptops (sidebar switches here)
xl: "1280px"   // Desktops
2xl: "1536px"  // Large desktops
```

### Responsive Patterns

#### Show/Hide Elements
```tsx
// Hidden on mobile, visible on desktop
<div className="hidden md:block">

// Visible on mobile, hidden on desktop
<div className="block md:hidden">
```

#### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Responsive columns: 1 → 2 → 4 */}
</div>
```

#### Responsive Typography
```tsx
<h1 className="text-4xl lg:text-5xl font-bold">
  {/* 40px mobile, 48px desktop */}
</h1>

<h2 className="text-3xl lg:text-4xl font-bold">
  {/* 30px mobile, 36px desktop */}
</h2>
```

#### Responsive Spacing
```tsx
<section className="py-16 lg:py-20">
  {/* 64px mobile, 80px desktop */}
</section>
```

#### Responsive Flex Direction
```tsx
<div className="flex flex-col sm:flex-row gap-4">
  {/* Stack on mobile, row on tablet+ */}
</div>
```

---

## Usage Guidelines

### 1. ALWAYS Use Constants

**❌ BAD:**
```tsx
<Button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
  Click me
</Button>
```

**✅ GOOD:**
```tsx
import { COMPONENT_CLASSES } from "@/constants/ui";

<Button className={COMPONENT_CLASSES.BUTTON_PRIMARY}>
  Click me
</Button>
```

### 2. Color Consistency

**❌ BAD:**
```tsx
<div className="bg-blue-500">
<div className="bg-blue-600">
<div className="text-gray-500">
<div className="text-gray-600">
```

**✅ GOOD:**
```tsx
<div className="bg-sample-blue">
<div className="bg-sample-blue-dark">
<div className="text-sample-gray-300">
<div className="text-sample-gray-500">
```

### 3. Spacing Consistency

**❌ BAD:**
```tsx
<section className="py-12">
<section className="py-16">
<section className="py-20">
```

**✅ GOOD:**
```tsx
<section className="py-16 lg:py-20">
{/* Consistent across all sections */}
```

### 4. Shadow Consistency

**❌ BAD:**
```tsx
<div className="shadow-md">
<div className="shadow-lg">
<div className="shadow-xl">
```

**✅ GOOD:**
```tsx
<div className="shadow-sample-sm">
<div className="shadow-sample">
```

### 5. Border Radius Consistency

**❌ BAD:**
```tsx
<div className="rounded-lg">
<div className="rounded-xl">
<div className="rounded-2xl">
```

**✅ GOOD:**
```tsx
import { DIMENSIONS } from "@/constants/ui";

<div className={DIMENSIONS.RADIUS_SM}>      {/* 8px */}
<div className={DIMENSIONS.RADIUS}>         {/* 16px */}
<div className={DIMENSIONS.RADIUS_FILE_DROP}> {/* 20px */}
<div className={DIMENSIONS.RADIUS_FULL}>     {/* rounded-3xl for chat */}
```

### 6. Icon Size Consistency

**❌ BAD:**
```tsx
<Icon className="w-4 h-4" />
<Icon className="w-5 h-5" />
<Icon className="w-6 h-6" />
```

**✅ GOOD:**
```tsx
import { SPACING } from "@/constants/ui";

<Icon className={SPACING.ICON_SIZE_SM} />  {/* 16px */}
<Icon className={SPACING.ICON_SIZE} />     {/* 20px */}
<Icon className={SPACING.ICON_SIZE_LG} />  {/* 24px */}
```

### 7. Animation Consistency

**❌ BAD:**
```tsx
<div className="transition duration-200">
<div className="transition-all duration-300">
<div className="hover:shadow-lg">
```

**✅ GOOD:**
```tsx
import { ANIMATIONS } from "@/constants/ui";

<div className={ANIMATIONS.TRANSITION_DEFAULT}>
<div className={ANIMATIONS.TRANSITION_SLOW}>
<div className={ANIMATIONS.HOVER_SHADOW}>
```

### 8. Import Organization

**Always organize imports:**
```tsx
// 1. React/Next imports
import { useState } from "react";
import Link from "next/link";

// 2. Third-party components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 3. Icons
import { Search, TrendingUp } from "lucide-react";

// 4. Constants (ALWAYS import what you need)
import { COMPONENT_CLASSES, SPACING, DIMENSIONS, ANIMATIONS } from "@/constants/ui";
```

---

## Component Examples

### Example 1: Feature Card

```tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SPACING, DIMENSIONS, ANIMATIONS } from "@/constants/ui";
import { Search } from "lucide-react";

export function FeatureCard() {
  return (
    <Card className={`border-border ${ANIMATIONS.HOVER_SHADOW} ${ANIMATIONS.TRANSITION_DEFAULT}`}>
      <CardHeader className="text-center pb-4">
        <div className={`mx-auto w-16 h-16 bg-sample-blue/10 ${DIMENSIONS.RADIUS_SM} flex items-center justify-center mb-4`}>
          <Search className="w-8 h-8 text-sample-blue" />
        </div>
        <h3 className="font-semibold text-foreground">Feature Title</h3>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm text-center leading-relaxed">
          Feature description goes here with consistent styling.
        </p>
      </CardContent>
    </Card>
  );
}
```

### Example 2: Section with Content

```tsx
import { COMPONENT_CLASSES } from "@/constants/ui";

export function HeroSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Main Headline with{" "}
              <span className={COMPONENT_CLASSES.TEXT_GRADIENT}>Gradient</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Descriptive paragraph with consistent styling and spacing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className={COMPONENT_CLASSES.BUTTON_PRIMARY}>
                Primary Action
              </Button>
              <Button variant="outline" size="lg" className={COMPONENT_CLASSES.BUTTON_SECONDARY}>
                Secondary Action
              </Button>
            </div>
          </div>

          <div className="relative">
            {/* Visual content */}
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Example 3: Navigation Bar

```tsx
import { Button } from "@/components/ui/button";
import { COMPONENT_CLASSES, LANDING_STYLES } from "@/constants/ui";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="bg-sample-gray-50 border-b border-border h-14 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-2xl font-bold text-sample-blue">
            Sample
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/features" className={LANDING_STYLES.NAV_LINK}>
              Features
            </Link>
            <Link href="/pricing" className={LANDING_STYLES.NAV_LINK}>
              Pricing
            </Link>

            <Button className={COMPONENT_CLASSES.BUTTON_PRIMARY}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

---

## Design System Checklist

Before shipping any frontend component, verify:

### Theme Support
- [ ] Uses semantic color classes (`bg-background`, `text-foreground`, `bg-card`, etc.)
- [ ] NO hard-coded colors (`bg-white`, `bg-black`, `text-gray-600`, etc.) except for special cases
- [ ] Tested in both light and dark modes
- [ ] All text is readable in both themes (proper contrast)
- [ ] Icons use semantic colors (`text-primary`, `text-foreground`, `text-muted-foreground`)
- [ ] Borders use `border-border` class
- [ ] Input fields use `bg-background` or `bg-card` with `text-foreground`
- [ ] Buttons use semantic classes or Shadcn/UI button variants

### Design Consistency
- [ ] Uses color constants from `sample-blue` and `sample-gray` palettes (legacy) or semantic classes (preferred)
- [ ] Uses spacing constants from `SPACING` or standard Tailwind scale
- [ ] Uses component classes from `COMPONENT_CLASSES`
- [ ] Uses animation constants from `ANIMATIONS`
- [ ] Uses dimension constants from `DIMENSIONS` for border radius
- [ ] Sections use `py-16 lg:py-20` for vertical padding
- [ ] Containers use `max-w-7xl` or `max-w-4xl` with proper padding
- [ ] Icons use size constants from `SPACING`
- [ ] Shadows use `shadow-sample` or `shadow-sample-sm`
- [ ] Responsive breakpoints follow `sm/md/lg/xl/2xl` pattern
- [ ] Typography follows heading/body hierarchy
- [ ] No arbitrary values unless absolutely necessary

### Accessibility
- [ ] Proper color contrast (WCAG AA minimum)
- [ ] Keyboard navigation works correctly
- [ ] ARIA labels where needed
- [ ] Focus states visible in both themes
- [ ] Screen reader friendly

---

## File Reference

### Key Files
- **Design Tokens**: `/frontend/tailwind.config.ts`
- **Component Constants**: `/frontend/constants/ui.ts`
- **Global Styles**: `/frontend/app/globals.css`
- **This Document**: `/frontend/DESIGN_SYSTEM.md`

### Constants File Structure

```typescript
// /frontend/constants/ui.ts
export const SPACING = { ... }        // Padding, margins, icon sizes
export const COLORS = { ... }         // Color references
export const DIMENSIONS = { ... }     // Border radius, widths, heights
export const ANIMATIONS = { ... }     // Transitions, animations
export const COMPONENT_CLASSES = { ... }  // Pre-built component classes
export const LANDING_STYLES = { ... } // Landing page specific styles
export const Z_INDEX = { ... }        // Z-index hierarchy
```

---

## Getting Help

### Questions?
1. Check this design system document first
2. Review `/frontend/constants/ui.ts` for available constants
3. Look at existing components in `/frontend/components/landing/` for examples
4. Review `tailwind.config.ts` for available Tailwind extensions

### Contributing
When adding new design patterns:
1. Add constants to `/constants/ui.ts`
2. Document in this file
3. Update existing components to use new patterns
4. Maintain consistency across the application

---

## Version History

- **v2.1.0** (2025-01-10): Dark/Light Mode Theme System
  - Added complete dark/light mode theming support using `next-themes`
  - Introduced semantic color classes (bg-background, text-foreground, etc.)
  - CSS variables for theme-aware colors in HSL format
  - Theme selection component in Settings page
  - Updated all components and utility classes to support both themes
  - Added theme-aware checklist and best practices
  - Browser autofill styling for both themes
  - Special cases documentation (footer, overlays)

- **v2.0.0** (2025-01-04): Comprehensive design system documentation
  - Complete color system with usage guidelines
  - Typography hierarchy and examples
  - Component library with code examples
  - Spacing and layout standards
  - Animation and transition patterns
  - Responsive design guidelines
  - Accessibility considerations
  - Usage guidelines and best practices

---

**Last Updated**: January 10, 2025
**Maintained By**: Sample AI Development Team
