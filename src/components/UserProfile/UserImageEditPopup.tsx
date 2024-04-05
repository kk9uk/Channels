import React, {FunctionComponent, useRef} from "react";
import {
    Box,
    Button,
    Divider, Flex, Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Stack,
    Text,
} from "@chakra-ui/react";
import ImageUpload from "../Posts/PostForm/ImageUpload";
import useSelectFile from "../../hooks/useSelectFile";

type EditImagePopupProp = {
    isOpened: boolean;
    onClose: () => void;
};

const UserImageEditPopupProp: FunctionComponent<EditImagePopupProp> = ({
                                                                           isOpened,
                                                                           onClose,
                                                                       }) => {
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const imageDataURL = reader.result;

                setSelectedFile(imageDataURL as string);
            };

            reader.readAsDataURL(file);
        }
    };

    const {selectedFile, setSelectedFile, onSelectFile} = useSelectFile();

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
                            <Flex justify={"center"} align={"center"} width={"100%"}>
                                {selectedFile ? (
                                    <>
                                        <Image src = {selectedFile} maxWidth = "400px" maxHeight = "400px" />
                                        <Stack direction = "row" mt = {4}>
                                            <Button
                                                variant = "outline"
                                                height = "28px"
                                                onClick = {() => setSelectedFile("")}
                                            >
                                                Remove image/video
                                            </Button>
                                        </Stack>
                                    </>
                                ) : (
                                    <Flex
                                        justify={"center"}
                                        align={"center"}
                                        p={20}
                                        border={"1px dashed"}
                                        borderColor={"gray.200"}
                                        borderRadius={4}
                                        width={"100%"}
                                    >
                                        <Button
                                            variant={"outline"}
                                            height={"28px"}
                                            onClick={() =>
                                                selectedFileRef.current?.click()
                                            }
                                        >
                                            Upload
                                        </Button>
                                        <Input type="file" ref={selectedFileRef} onChange={handleImageUpload} hidden/>
                                        {/*<input*/}
                                        {/*    ref={selectedFileRef}*/}
                                        {/*    type= "file"*/}
                                        {/*    hidden*/}
                                        {/*    onChange={onSelectedImage}*/}
                                        {/*/>*/}
                                        <Image src={selectedFile} alt={"selected file"} />

                                    </Flex>
                                )}
                            </Flex>
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