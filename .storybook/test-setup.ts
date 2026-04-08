import { expect } from "@storybook/test";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);
