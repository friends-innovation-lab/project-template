import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config) => {
    config.define = {
      ...config.define,
      "process.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(
        "http://localhost:54321",
      ),
      "process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(
        "mock-anon-key-for-storybook",
      ),
    };
    return config;
  },
};

export default config;
