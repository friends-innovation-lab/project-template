import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@trussworks/react-uswds";

const meta: Meta<typeof Button> = {
  title: "USWDS/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Default button", type: "button" },
};
export const Secondary: Story = {
  args: { children: "Secondary button", type: "button", outline: true },
};
export const Unstyled: Story = {
  args: { children: "Unstyled button", type: "button", unstyled: true },
};
export const Big: Story = {
  args: { children: "Big button", type: "button", size: "big" },
};
