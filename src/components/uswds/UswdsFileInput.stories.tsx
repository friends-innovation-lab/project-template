import type { Meta } from "@storybook/nextjs-vite";
import { FileInput, Label, FormGroup } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/FileInput",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

export const Default = () => (
  <FormGroup>
    <Label htmlFor="file-input">Upload your DD-214</Label>
    <FileInput id="file-input" name="file-input" />
  </FormGroup>
);
export const MultipleFiles = () => (
  <FormGroup>
    <Label htmlFor="file-input-multiple">Upload supporting documents</Label>
    <FileInput id="file-input-multiple" name="file-input-multiple" multiple />
  </FormGroup>
);
export const AcceptedTypes = () => (
  <FormGroup>
    <Label htmlFor="file-input-specific">
      Upload DD-214 (PDF or image only)
    </Label>
    <FileInput
      id="file-input-specific"
      name="file-input-specific"
      accept=".pdf,.jpg,.png"
    />
  </FormGroup>
);
