import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";
import tokens from "./tokens.json";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── FFTC Brand Colors ───────────────────────────
      // Token values imported from tokens.json
      // To update tokens: edit tokens.json directly
      // When Tokens Studio is connected, this file will be
      // updated automatically via GitHub sync
      colors: {
        // Primary FFTC brand
        "fftc-yellow": tokens.fftc.yellow.value,
        "fftc-black": tokens.fftc.black.value,
        "fftc-white": tokens.fftc.white.value,
        // Secondary — NYC subway inspired
        "secondary-orange": tokens.secondary.orange.value,
        "secondary-pink": tokens.secondary.pink.value,
        "secondary-green": tokens.secondary.green.value,
        "secondary-blue": tokens.secondary.blue.value,
        "secondary-red": tokens.secondary.red.value,
        // Government neutral — backgrounds, borders, text
        gov: {
          50: tokens.gov["50"].value,
          100: tokens.gov["100"].value,
          200: tokens.gov["200"].value,
          300: tokens.gov["300"].value,
          400: tokens.gov["400"].value,
          500: tokens.gov["500"].value,
          600: tokens.gov["600"].value,
          700: tokens.gov["700"].value,
          800: tokens.gov["800"].value,
          900: tokens.gov["900"].value,
          950: tokens.gov["950"].value,
        },
        // Status colors — accessible contrast ratios baked in
        success: tokens.status.success.value,
        warning: tokens.status.warning.value,
        error: tokens.status.error.value,
        info: tokens.status.info.value,

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      // ─── Typography ──────────────────────────────────
      fontFamily: {
        sans: [tokens.font.sans.value.split(", ")[0], ...fontFamily.sans],
        mono: [tokens.font.mono.value.split(", ")[0], ...fontFamily.mono],
      },
      fontSize: {
        // Slightly tighter scale for data-dense gov interfaces
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },

      // ─── Border Radius ───────────────────────────────
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // ─── Shadows ─────────────────────────────────────
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        panel: "0 0 0 1px rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1)",
      },

      // ─── Animations ──────────────────────────────────
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
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
