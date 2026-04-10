import type { Meta } from "@storybook/nextjs-vite";
import { Textarea, Label, FormGroup } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/Textarea",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

export const Default = () => (
  <FormGroup>
    <Label htmlFor="textarea">Additional notes</Label>
    <Textarea id="textarea" name="textarea" />
  </FormGroup>
);
export const WithError = () => (
  <FormGroup error>
    <Label htmlFor="textarea-error" error>
      Additional notes
    </Label>
    <Textarea id="textarea-error" name="textarea-error" error />
  </FormGroup>
);
