import type { Meta } from "@storybook/nextjs-vite";
import { StepIndicator, StepIndicatorStep } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/StepIndicator",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

export const Step1 = () => (
  <StepIndicator headingLevel="h4">
    <StepIndicatorStep label="Service status" status="current" />
    <StepIndicatorStep label="Benefit type" status="incomplete" />
    <StepIndicatorStep label="Review" status="incomplete" />
  </StepIndicator>
);

export const Step2 = () => (
  <StepIndicator headingLevel="h4">
    <StepIndicatorStep label="Service status" status="complete" />
    <StepIndicatorStep label="Benefit type" status="current" />
    <StepIndicatorStep label="Review" status="incomplete" />
  </StepIndicator>
);

export const Complete = () => (
  <StepIndicator headingLevel="h4">
    <StepIndicatorStep label="Service status" status="complete" />
    <StepIndicatorStep label="Benefit type" status="complete" />
    <StepIndicatorStep label="Review" status="complete" />
  </StepIndicator>
);
