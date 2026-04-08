import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SignupForm } from "./signup-form";

const meta: Meta<typeof SignupForm> = {
  title: "Auth/SignupForm",
  component: SignupForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/signup",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SignupForm>;

export const Default: Story = {};
