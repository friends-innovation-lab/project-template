import type { Meta } from "@storybook/nextjs-vite";
import { ComboBox, Label, FormGroup } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/ComboBox",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

const stateOptions = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "VA", label: "Virginia" },
];

export const Default = () => (
  <FormGroup>
    <Label htmlFor="combo-state">State of residence</Label>
    <ComboBox
      id="combo-state"
      name="combo-state"
      options={stateOptions}
      onChange={() => {}}
    />
  </FormGroup>
);
