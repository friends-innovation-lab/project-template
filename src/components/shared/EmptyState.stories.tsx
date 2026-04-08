import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyState } from "./empty-state";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof EmptyState> = {
  title: "Shared/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "No items yet",
    description: "Get started by creating your first item.",
  },
};

export const WithAction: Story = {
  args: {
    title: "No results found",
    description: "Try adjusting your search or filters.",
    action: <Button>Clear filters</Button>,
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Nothing here yet",
  },
};
