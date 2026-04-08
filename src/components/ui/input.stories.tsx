import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="email-error">Email</Label>
      <Input
        id="email-error"
        type="email"
        placeholder="you@example.com"
        aria-invalid="true"
        aria-describedby="email-error-message"
        className="border-destructive focus-visible:ring-destructive"
      />
      <p
        id="email-error-message"
        className="text-sm text-destructive"
        role="alert"
      >
        Please enter a valid email address
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "user@example.com",
    type: "email",
  },
};
