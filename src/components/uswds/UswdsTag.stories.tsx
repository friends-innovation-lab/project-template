import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tag } from "@trussworks/react-uswds";

const meta: Meta<typeof Tag> = {
  title: "USWDS/Tag",
  component: Tag,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { children: "Healthcare" },
};
export const WithBackground: Story = {
  args: { children: "Education", background: "#1a4480" },
};
