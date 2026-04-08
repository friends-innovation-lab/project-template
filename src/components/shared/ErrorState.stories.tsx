import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ErrorState } from "./error-state";

const meta: Meta<typeof ErrorState> = {
  title: "Shared/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: {
    error: "Something went wrong. Please try again.",
  },
};

export const WithRetry: Story = {
  args: {
    error: "Failed to load data.",
    retry: () => {},
  },
};

export const NetworkError: Story = {
  args: {
    error: new Error("Network request failed"),
    retry: () => {},
  },
};
