import {
	Button,
	type ButtonProps,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import type { FC } from "react";
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
