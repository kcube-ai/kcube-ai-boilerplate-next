import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Sample Brand Colors - Clean and systematic
        sample: {
          blue: {
            DEFAULT: '#059FFF',
            dark: '#0589e6',
            50: '#f0f9ff',
            100: '#e0f2fe',
            500: '#059FFF',
            600: '#0589e6',
          },
          gray: {
            50: '#FAFAFA',
            100: '#F4F4F4',
            200: '#ECECEC',
            300: '#5F6368',
            400: '#6D7175',
            500: '#202123',
            600: '#000000',
          },
        },

        // Shadcn/UI Colors (mapped to Sample colors with dark mode support)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          "1": '#059FFF',
          "2": '#ECECEC',
          "3": '#5F6368',
          "4": '#F4F4F4',
          "5": '#FAFAFA',
        },
        sidebar: {
          DEFAULT: '#FAFAFA',
          foreground: '#000000',
          primary: '#059FFF',
          'primary-foreground': '#FFFFFF',
          accent: '#ECECEC',
          'accent-foreground': '#000000',
          border: 'rgba(0, 0, 0, 0.1)',
          ring: '#059FFF',
        },
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontSize: {
        'xs': ['10px', { lineHeight: '12px', fontWeight: '400' }],
        'sm': ['12px', { lineHeight: '16px', fontWeight: '300' }],
        'base': ['14px', { lineHeight: '16px', fontWeight: '400' }],
        'lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'xl': ['20px', { lineHeight: '24px', fontWeight: '600' }],
        '2xl': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        '3xl': ['40px', { lineHeight: '54px', fontWeight: '600' }],
      },
      spacing: {
        '4.5': '18px',
        '18': '72px',
        '22': '88px',
        '62.5': '250px', // File drop height
        '142.5': '570px', // Chat history height  
        '71.25': '285px', // Document chat height
      },
      width: {
        'sidebar': '20.8%',
        'main': '79.2%',
        'mobile-sidebar': '250px',
      },
      height: {
        'file-drop': '250px',
        'chat-history': '570px',
        'document-chat': '285px',
      },
      maxWidth: {
        'chat-message': '32rem', // 512px for chat bubbles
      },
      boxShadow: {
        'sample': '0 10px 20px rgba(0,0,0,.1)',
        'sample-sm': '0 2px 4px rgba(0,0,0,.05)',
      },
      backdropBlur: {
        'sample': '10px',
      },
      backgroundImage: {
        'landing': "url('/images/bg.png')",
        'login': "url('/images/bg_login.png')",
        'shadow-box': "url('/images/shadow.png')",
        'plus-icon': "url('/images/plus-icon.svg')",
      },
      backgroundBlendMode: {
        'overlay': 'overlay',
      },
      opacity: {
        '70': '0.7',
        '94': '0.94',
      },
      zIndex: {
        '1000': '1000',
        '9999': '9999',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-dot": "pulse-dot 1.5s infinite",
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities, addComponents }: { addUtilities: any, addComponents: any }) {
      // Component-level utilities
      const components = {
        // Button Components
        '.btn-primary': {
          '@apply bg-primary text-primary-foreground px-4 py-3.5 rounded-sm text-xs font-normal transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2': {},
        },
        '.btn-secondary': {
          '@apply bg-card text-foreground border border-border px-4 py-2 rounded-sm text-sm font-bold transition-all duration-200 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2': {},
        },
        '.btn-ghost': {
          '@apply text-muted-foreground hover:bg-accent px-2 py-2 rounded-sm transition-colors duration-200': {},
        },

        // Input Components
        '.input-primary': {
          '@apply border border-border rounded-sm px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground placeholder:font-light focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200': {},
        },
        '.input-search': {
          '@apply input-primary bg-muted rounded-2xl px-4 py-2': {},
        },

        // Card Components
        '.card-primary': {
          '@apply bg-card text-card-foreground border border-border rounded-lg p-6 shadow-sample-sm': {},
        },
        '.card-hover': {
          '@apply card-primary transition-all duration-200 hover:shadow-sample': {},
        },

        // Chat Components
        '.chat-bubble-user': {
          '@apply bg-primary text-primary-foreground px-4 py-3 rounded-3xl text-sm max-w-chat-message ml-auto': {},
        },
        '.chat-bubble-ai': {
          '@apply bg-muted text-foreground px-4 py-3 rounded-3xl text-sm max-w-chat-message': {},
        },
        '.chat-input': {
          '@apply w-full border-none bg-background text-foreground p-2.5 px-5 rounded-t-lg border-b border-border resize-none focus:outline-none placeholder:text-muted-foreground placeholder:text-sm placeholder:font-light': {},
        },
        '.chat-container': {
          '@apply border border-border rounded-lg p-0': {},
        },

        // File Upload Components
        '.file-drop-zone': {
          '@apply relative h-file-drop flex flex-col justify-center items-center border border-border max-w-full p-6 bg-card rounded-xl shadow-sample transition-all duration-300': {},
        },
        '.file-input': {
          '@apply absolute inset-0 w-full h-full cursor-pointer opacity-0 focus:outline-none': {},
        },

        // Navigation Components
        '.nav-item': {
          '@apply px-2 py-2 gap-2 text-foreground rounded-sm hover:bg-accent transition-colors duration-200 flex items-center': {},
        },
        '.nav-item-active': {
          '@apply bg-accent': {},
        },

        // Layout Components
        '.sidebar-container': {
          '@apply relative bg-muted border-r border-border': {},
        },
        '.main-content': {
          '@apply flex-1 overflow-hidden': {},
        },

        // Modal Components
        '.modal-content': {
          '@apply bg-card rounded-lg border border-border shadow-lg': {},
        },
        '.modal-backdrop': {
          '@apply bg-background/94 backdrop-blur-sample': {},
        },

        // Flash/Toast Components
        '.flash-message': {
          '@apply fixed bottom-4 right-4 bg-foreground text-background rounded-sm px-4 py-2 z-50': {},
        },

        // Table Components
        '.table-wrapper': {
          '@apply block overflow-x-auto whitespace-nowrap': {},
        },

        // Loading Components
        '.loader-center': {
          '@apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-9999': {},
        },
      }

      // Utility classes
      const utilities = {
        // Background utilities
        '.bg-landing': {
          '@apply bg-background/94 bg-no-repeat bg-cover bg-blend-overlay w-full': {},
        },
        '.bg-login': {
          '@apply h-full w-full bg-center bg-no-repeat bg-cover': {},
        },
        '.bg-shadow-box': {
          '@apply bg-cover bg-center': {},
        },

        // Glass effect
        '.glass-effect': {
          '@apply bg-background/95 backdrop-blur-sample': {},
        },

        // Scroll utilities
        '.scroll-custom': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'hsl(var(--muted))',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'hsl(var(--accent))',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'hsl(var(--muted-foreground))',
          },
        },

        // Height utilities for specific components
        '.h-chat-history': {
          '@apply overflow-y-auto scroll-custom': {},
        },
        '.h-document-chat': {
          '@apply overflow-y-auto scroll-custom': {},
        },

        // Position utilities
        '.fixed-chat-input': {
          '@apply fixed bottom-4 w-3/4': {},
        },

        // Hide/Show utilities
        '.hide-dropdown-arrow::after': {
          display: 'none !important',
        },
        '.hide-reveal': {
          '&::-ms-reveal': {
            display: 'none',
          },
        },

        // Print utilities
        '.no-print': {
          '@media print': {
            display: 'none !important',
          },
        },

        // Focus utilities
        '.focus-ring': {
          '&:focus, &:focus-visible': {
            '@apply outline-2 outline-ring outline-offset-2': {},
          },
        },

        // Responsive utilities for sidebar
        '.desktop-sidebar': {
          '@screen lg': {
            '@apply w-sidebar': {},
          },
        },
        '.desktop-main': {
          '@screen lg': {
            '@apply w-main': {},
          },
        },
        '.mobile-sidebar': {
          '@apply lg:hidden absolute w-mobile-sidebar h-screen z-1000 overflow-y-auto bg-muted border border-border': {},
        },
        '.mobile-hidden': {
          '@apply hidden lg:block': {},
        },
      }

      addComponents(components)
      addUtilities(utilities)
    }
  ],
};
export default config;
