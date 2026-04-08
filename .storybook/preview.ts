import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

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
};

export default preview;
