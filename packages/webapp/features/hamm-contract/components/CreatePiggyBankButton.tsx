import { FC } from "react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
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
      <Button
        {...props}
        onClick={onOpen}
        leftIcon={<PlusCircleIcon width={20} height={20} />}
      >
        {props.children ?? "Create"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
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
