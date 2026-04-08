import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header } from "./header";

const meta: Meta<typeof Header> = {
  title: "Layout/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/dashboard",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    user: {
      id: "1",
      email: "user@example.com",
      app_metadata: {},
      user_metadata: { name: "Jane Doe" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    },
  },
};
