import type { Meta } from "@storybook/nextjs-vite";
import {
  ProcessList,
  ProcessListItem,
  ProcessListHeading,
} from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/ProcessList",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

export const Default = () => (
  <ProcessList>
    <ProcessListItem>
      <ProcessListHeading type="h4">Gather your documents</ProcessListHeading>
      <p>
        You will need your DD-214, Social Security number, and any relevant
        medical records.
      </p>
    </ProcessListItem>
    <ProcessListItem>
      <ProcessListHeading type="h4">
        Complete the application
      </ProcessListHeading>
      <p>
        Fill out VA Form 10-10EZ online at VA.gov or in person at your nearest
        VA medical center.
      </p>
    </ProcessListItem>
    <ProcessListItem>
      <ProcessListHeading type="h4">
        Submit and wait for confirmation
      </ProcessListHeading>
      <p>
        After submitting, you will receive a confirmation number. Processing
        typically takes 1-2 weeks.
      </p>
    </ProcessListItem>
    <ProcessListItem>
      <ProcessListHeading type="h4">Receive your decision</ProcessListHeading>
      <p>
        VA will notify you by mail and through your online account when a
        decision has been made.
      </p>
    </ProcessListItem>
  </ProcessList>
);
