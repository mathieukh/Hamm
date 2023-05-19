import { FC } from "react";
import {
  Button,
  ButtonProps,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { CreatePiggyBankForm } from "./CreatePiggyBankForm";

export const CreatePiggyBankButton: FC<ButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button {...props} onClick={onOpen}>
        {props.children ?? "Create"}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a piggy bank</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreatePiggyBankForm onPiggyBankCreated={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
