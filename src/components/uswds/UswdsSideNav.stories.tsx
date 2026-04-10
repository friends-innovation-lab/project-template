import type { Meta } from "@storybook/nextjs-vite";
import { SideNav } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/SideNav",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

export const Default = () => (
  <SideNav
    items={[
      <a href="#" key="overview">
        Overview
      </a>,
      <a href="#" key="eligibility" className="usa-current">
        Eligibility
      </a>,
      <a href="#" key="apply">
        How to apply
      </a>,
      <a href="#" key="after">
        After you apply
      </a>,
      <a href="#" key="manage">
        Manage your benefits
      </a>,
    ]}
  />
);
