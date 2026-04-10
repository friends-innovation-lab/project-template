import type { Meta } from "@storybook/nextjs-vite";
import { Table } from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/Table",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

export const Default = () => (
  <Table>
    <thead>
      <tr>
        <th scope="col">Benefit</th>
        <th scope="col">Status</th>
        <th scope="col">Date submitted</th>
        <th scope="col">Decision date</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>VA Health Care</td>
        <td>Approved</td>
        <td>January 15, 2024</td>
        <td>February 3, 2024</td>
      </tr>
      <tr>
        <td>Disability Compensation</td>
        <td>Pending</td>
        <td>March 1, 2024</td>
        <td>—</td>
      </tr>
      <tr>
        <td>Post-9/11 GI Bill</td>
        <td>In review</td>
        <td>March 10, 2024</td>
        <td>—</td>
      </tr>
    </tbody>
  </Table>
);

export const Striped = () => (
  <Table striped>
    <thead>
      <tr>
        <th scope="col">Benefit</th>
        <th scope="col">Status</th>
        <th scope="col">Date submitted</th>
        <th scope="col">Decision date</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>VA Health Care</td>
        <td>Approved</td>
        <td>January 15, 2024</td>
        <td>February 3, 2024</td>
      </tr>
      <tr>
        <td>Disability Compensation</td>
        <td>Pending</td>
        <td>March 1, 2024</td>
        <td>—</td>
      </tr>
      <tr>
        <td>Post-9/11 GI Bill</td>
        <td>In review</td>
        <td>March 10, 2024</td>
        <td>—</td>
      </tr>
    </tbody>
  </Table>
);

export const Scrollable = () => (
  <Table scrollable>
    <thead>
      <tr>
        <th scope="col">Benefit</th>
        <th scope="col">Status</th>
        <th scope="col">Date submitted</th>
        <th scope="col">Decision date</th>
        <th scope="col">Case number</th>
        <th scope="col">Assigned to</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>VA Health Care</td>
        <td>Approved</td>
        <td>January 15, 2024</td>
        <td>February 3, 2024</td>
        <td>VA-2024-001234</td>
        <td>Regional Office — NYC</td>
      </tr>
      <tr>
        <td>Disability Compensation</td>
        <td>Pending</td>
        <td>March 1, 2024</td>
        <td>—</td>
        <td>VA-2024-005678</td>
        <td>Regional Office — NYC</td>
      </tr>
    </tbody>
  </Table>
);
