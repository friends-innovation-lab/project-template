import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert } from "@trussworks/react-uswds";
import "@trussworks/react-uswds/lib/index.css";

const meta: Meta<typeof Alert> = {
  title: "USWDS/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    type: "info",
    heading: "Informative status",
    headingLevel: "h4",
    children: "Additional context about this status.",
  },
};
export const Success: Story = {
  args: {
    type: "success",
    heading: "Success status",
    headingLevel: "h4",
    children: "Your submission was successful.",
  },
};
export const Warning: Story = {
  args: {
    type: "warning",
    heading: "Warning status",
    headingLevel: "h4",
    children: "Please review before continuing.",
  },
};
export const Error: Story = {
  args: {
    type: "error",
    heading: "Error status",
    headingLevel: "h4",
    children: "There was a problem with your submission.",
  },
};
