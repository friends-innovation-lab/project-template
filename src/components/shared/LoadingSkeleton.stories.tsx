import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoadingSkeleton } from "./loading-skeleton";

const meta: Meta<typeof LoadingSkeleton> = {
  title: "Shared/LoadingSkeleton",
  component: LoadingSkeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSkeleton>;

export const Default: Story = {};
