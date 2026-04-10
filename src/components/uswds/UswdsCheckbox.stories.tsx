import type { Meta } from "@storybook/nextjs-vite";
import { Checkbox, Fieldset } from "@trussworks/react-uswds";
import "@trussworks/react-uswds/lib/index.css";

const meta: Meta = {
  title: "USWDS/Checkbox",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;

export const Default = () => (
  <Fieldset legend="Select benefits">
    <Checkbox
      id="healthcare"
      name="benefits"
      label="Healthcare"
      value="healthcare"
    />
    <Checkbox
      id="education"
      name="benefits"
      label="Education and Training"
      value="education"
    />
    <Checkbox id="housing" name="benefits" label="Housing" value="housing" />
  </Fieldset>
);

export const Tile = () => (
  <Fieldset legend="Select benefits">
    <Checkbox
      id="healthcare-tile"
      name="benefits-tile"
      label="Healthcare"
      value="healthcare"
      tile
    />
    <Checkbox
      id="education-tile"
      name="benefits-tile"
      label="Education and Training"
      value="education"
      tile
    />
  </Fieldset>
);
