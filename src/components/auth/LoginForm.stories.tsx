import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoginForm } from "./login-form";

const meta: Meta<typeof LoginForm> = {
  title: "Auth/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};
