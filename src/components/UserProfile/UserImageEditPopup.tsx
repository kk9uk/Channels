import React, { FunctionComponent } from "react";
import {
    Box,
    Button,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from "@chakra-ui/react";

type EditImagePopupProp = {
    isOpened: boolean;
    onClose: () => void;
};

const UserImageEditPopupProp: FunctionComponent<EditImagePopupProp> = ({
                                                                           isOpened,
                                                                           onClose,
                                                                       }) => {
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        // Perform any necessary image upload logic here
    };

    return (
        <>
            <Modal isOpen={isOpened} onClose={onClose}>
                <ModalOverlay />
                <ModalHeader
                    display="flex"
                    flexDirection="column"
                    fontSize={15}
                    padding={3}
                    ml={1}
                >
                    Edit your own profile image
                </ModalHeader>
                <ModalContent>
                    <ModalBody>
                        <Box>
                            <Text>Choose an image to upload:</Text>
                            <Input type="file" onChange={handleImageUpload} />
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UserImageEditPopupProp;