import type { Meta } from "@storybook/nextjs-vite";
import { TextInput, Label, FormGroup } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/TextInput",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;

export const Default = () => (
  <FormGroup>
    <Label htmlFor="input-default">Text input label</Label>
    <TextInput id="input-default" name="input-default" type="text" />
  </FormGroup>
);

export const WithError = () => (
  <FormGroup error>
    <Label htmlFor="input-error" error>
      Text input label
    </Label>
    <TextInput
      id="input-error"
      name="input-error"
      type="text"
      validationStatus="error"
    />
  </FormGroup>
);

export const Disabled = () => (
  <FormGroup>
    <Label htmlFor="input-disabled">Text input label</Label>
    <TextInput id="input-disabled" name="input-disabled" type="text" disabled />
  </FormGroup>
);
