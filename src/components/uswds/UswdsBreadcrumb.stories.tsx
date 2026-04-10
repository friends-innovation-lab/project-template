import type { Meta } from "@storybook/nextjs-vite";
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
} from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/Breadcrumb",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

export const Default = () => (
  <BreadcrumbBar>
    <Breadcrumb>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </Breadcrumb>
    <Breadcrumb>
      <BreadcrumbLink href="/benefits">Benefits</BreadcrumbLink>
    </Breadcrumb>
    <Breadcrumb current>
      <span>Health Care</span>
    </Breadcrumb>
  </BreadcrumbBar>
);
