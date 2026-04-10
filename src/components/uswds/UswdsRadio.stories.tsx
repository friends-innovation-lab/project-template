import type { Meta } from "@storybook/nextjs-vite";
import { Radio, Fieldset } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/Radio",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;

export const Default = () => (
  <Fieldset legend="Service status">
    <Radio id="veteran" name="service-status" label="Veteran" value="veteran" />
    <Radio
      id="active-duty"
      name="service-status"
      label="Active Duty"
      value="active-duty"
    />
    <Radio
      id="national-guard"
      name="service-status"
      label="Reserve / National Guard"
      value="national-guard"
    />
  </Fieldset>
);

export const Tile = () => (
  <Fieldset legend="Service status">
    <Radio
      id="veteran-tile"
      name="service-status-tile"
      label="Veteran"
      value="veteran"
      tile
    />
    <Radio
      id="active-duty-tile"
      name="service-status-tile"
      label="Active Duty"
      value="active-duty"
      tile
    />
  </Fieldset>
);
