import type { Meta } from "@storybook/nextjs-vite";
import { Accordion } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/Accordion",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

const items = [
  {
    title: "What documents do I need to apply?",
    content: (
      <p>
        You will need your DD-214, Social Security number, and proof of income.
        Additional documents may be required depending on the benefit type.
      </p>
    ),
    expanded: false,
    id: "doc-requirements",
    headingLevel: "h4" as const,
  },
  {
    title: "How long does the application process take?",
    content: (
      <p>
        Processing times vary by benefit type. Most applications are processed
        within 30-60 days. You will receive updates by mail and through your
        online account.
      </p>
    ),
    expanded: false,
    id: "processing-time",
    headingLevel: "h4" as const,
  },
  {
    title: "Can I apply on behalf of someone else?",
    content: (
      <p>
        Yes. Authorized representatives and VSOs may apply on behalf of a
        veteran with proper authorization documentation.
      </p>
    ),
    expanded: false,
    id: "on-behalf",
    headingLevel: "h4" as const,
  },
];

export const Default = () => <Accordion items={items} />;
export const Bordered = () => <Accordion items={items} bordered />;
export const Multiselectable = () => (
  <Accordion items={items} multiselectable />
);
