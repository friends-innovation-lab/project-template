import type { Meta } from "@storybook/nextjs-vite";
import { DatePicker, Label, FormGroup } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/DatePicker",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

export const Default = () => (
  <FormGroup>
    <Label htmlFor="date-picker">Date of discharge</Label>
    <DatePicker id="date-picker" name="date-picker" />
  </FormGroup>
);
export const WithMinMax = () => (
  <FormGroup>
    <Label htmlFor="date-picker-range">Select appointment date</Label>
    <DatePicker
      id="date-picker-range"
      name="date-picker-range"
      minDate="2024-01-01"
      maxDate="2025-12-31"
    />
  </FormGroup>
);
