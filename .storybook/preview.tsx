import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import "@trussworks/react-uswds/lib/index.css";
import "../src/app/globals.css";
import { themes } from "./themes";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Run accessibility checks on every story
      config: {
        rules: [
          {
            // These rules are checked automatically
            id: "color-contrast",
            enabled: true,
          },
        ],
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FEFAF1" },
        { name: "dark", value: "#0D0D0D" },
        { name: "white", value: "#ffffff" },
      ],
    },
  },
  globalTypes: {
    agencyTheme: {
      description: "Agency design system theme",
      defaultValue: "fftc",
      toolbar: {
        title: "Agency Theme",
        icon: "paintbrush",
        items: [
          { value: "fftc", title: "FFTC Brand" },
          { value: "uswds", title: "USWDS Baseline" },
          { value: "va", title: "VA Design System" },
          { value: "cms", title: "CMS Design System" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeKey = context.globals.agencyTheme as keyof typeof themes;
      const theme = themes[themeKey] || themes.fftc;
      return (
        <div
          style={
            {
              "--agency-primary": theme.colors.primary,
              "--agency-background": theme.colors.background,
              "--agency-text": theme.colors.text,
              "--agency-cta": theme.colors.cta,
              "--agency-cta-text": theme.colors.ctaText,
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              padding: "1rem",
              minHeight: "100%",
            } as React.CSSProperties
          }
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
