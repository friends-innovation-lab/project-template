import type { Meta } from "@storybook/nextjs-vite";
import {
  Modal,
  ModalHeading,
  ModalFooter,
  ButtonGroup,
  Button,
  ModalToggleButton,
} from "@trussworks/react-uswds";
import type { ModalRef } from "@trussworks/react-uswds";
import { useRef } from "react";

const meta: Meta = {
  title: "USWDS/Modal",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;

export const Default = () => {
  const modalRef = useRef<ModalRef>(null);
  const modalId = "confirm-modal";
  return (
    <div>
      <ModalToggleButton modalRef={modalRef} opener>
        Open confirmation
      </ModalToggleButton>
      <Modal
        ref={modalRef}
        id={modalId}
        aria-labelledby="modal-heading"
        aria-describedby="modal-description"
      >
        <ModalHeading id="modal-heading">Confirm your submission</ModalHeading>
        <p id="modal-description">
          Are you sure you want to submit this application? You will not be able
          to make changes after submission.
        </p>
        <ModalFooter>
          <ButtonGroup>
            <ModalToggleButton
              modalRef={modalRef}
              closer
              unstyled
              className="padding-105 text-center"
            >
              Cancel
            </ModalToggleButton>
            <Button type="button">Submit application</Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </div>
  );
};
