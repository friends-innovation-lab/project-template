import type { Meta } from "@storybook/nextjs-vite";
import { CharacterCount, Label, FormGroup } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/CharacterCount",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

export const Default = () => (
  <FormGroup>
    <Label htmlFor="with-count">Describe your condition</Label>
    <CharacterCount
      id="with-count"
      name="with-count"
      maxLength={300}
      isTextArea
      rows={4}
    />
  </FormGroup>
);
