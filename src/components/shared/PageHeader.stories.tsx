import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageHeader } from "./page-header";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof PageHeader> = {
  title: "Shared/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "Dashboard",
  },
};

export const WithDescription: Story = {
  args: {
    title: "All Projects",
    description: "Manage and track your active projects.",
  },
};

export const WithAction: Story = {
  args: {
    title: "All Projects",
    description: "Manage and track your active projects.",
    action: <Button>New project</Button>,
  },
};
