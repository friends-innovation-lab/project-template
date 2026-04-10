import type { Meta } from "@storybook/nextjs-vite";
import { Select, Label, FormGroup } from "@trussworks/react-uswds";
import "@trussworks/react-uswds/lib/index.css";

const meta: Meta = {
  title: "USWDS/Select",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;

export const Default = () => (
  <FormGroup>
    <Label htmlFor="select-default">Select label</Label>
    <Select id="select-default" name="select-default">
      <option value="">- Select -</option>
      <option value="va">Department of Veterans Affairs</option>
      <option value="hhs">Health and Human Services</option>
      <option value="cms">Centers for Medicare and Medicaid</option>
    </Select>
  </FormGroup>
);
