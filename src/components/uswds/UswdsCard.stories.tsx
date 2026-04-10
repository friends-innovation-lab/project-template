import type { Meta } from "@storybook/nextjs-vite";
import {
  Card,
  CardGroup,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@trussworks/react-uswds";

const meta: Meta = {
  title: "USWDS/Card",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

export const Default = () => (
  <Card>
    <CardHeader>
      <h3 className="usa-card__heading">VA Health Care</h3>
    </CardHeader>
    <CardBody>
      <p>
        Comprehensive medical benefits including primary care, mental health,
        and prescriptions.
      </p>
    </CardBody>
    <CardFooter>
      <Button type="button">Apply now</Button>
    </CardFooter>
  </Card>
);

export const Group = () => (
  <CardGroup>
    <Card gridLayout={{ tablet: { col: 4 } }}>
      <CardHeader>
        <h3 className="usa-card__heading">VA Health Care</h3>
      </CardHeader>
      <CardBody>
        <p>Comprehensive medical benefits.</p>
      </CardBody>
      <CardFooter>
        <Button type="button">Learn more</Button>
      </CardFooter>
    </Card>
    <Card gridLayout={{ tablet: { col: 4 } }}>
      <CardHeader>
        <h3 className="usa-card__heading">Post-9/11 GI Bill</h3>
      </CardHeader>
      <CardBody>
        <p>Education and housing benefits.</p>
      </CardBody>
      <CardFooter>
        <Button type="button">Learn more</Button>
      </CardFooter>
    </Card>
    <Card gridLayout={{ tablet: { col: 4 } }}>
      <CardHeader>
        <h3 className="usa-card__heading">Disability Compensation</h3>
      </CardHeader>
      <CardBody>
        <p>Monthly payments for service-connected conditions.</p>
      </CardBody>
      <CardFooter>
        <Button type="button">Learn more</Button>
      </CardFooter>
    </Card>
  </CardGroup>
);
