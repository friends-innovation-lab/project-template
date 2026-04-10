import type { Meta } from "@storybook/nextjs-vite";
import { GovBanner } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/Banner",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Default = () => <GovBanner />;
export const Spanish = () => <GovBanner language="spanish" />;
