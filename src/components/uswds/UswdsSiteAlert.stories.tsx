import type { Meta } from "@storybook/nextjs-vite";
import { SiteAlert } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/SiteAlert",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Info = () => (
  <SiteAlert variant="info" heading="This is a beta site">
    This site is still being tested. For official information, visit VA.gov.
  </SiteAlert>
);
export const Emergency = () => (
  <SiteAlert variant="emergency" heading="System maintenance">
    Applications will be unavailable on Sunday from 2-6am EST.
  </SiteAlert>
);
