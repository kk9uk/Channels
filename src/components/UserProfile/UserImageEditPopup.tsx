import React, {FunctionComponent, useRef} from "react";
import {
    Box,
    Button,
    Flex, Icon, Image,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay, Stack,
    Text,
} from "@chakra-ui/react";
import useSelectFile from "../../hooks/useSelectFile";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {User} from "../../state/userState";
import {doc, updateDoc} from "firebase/firestore";
import {firestore, storage} from "../../firebase/clientApp";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {useRouter} from "next/router";

type EditImagePopupProp = {
    user: User;
    isOpened: boolean;
    onClose: () => void;
};

const UserImageEditPopupProp: FunctionComponent<EditImagePopupProp> = ({
                                                                           user,
                                                                           isOpened,
                                                                           onClose,
                                                                       }) => {
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const {selectedFile, setSelectedFile} = useSelectFile();
    const router =useRouter()

    // Function to handle image upload
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


    // Function to save the uploaded image
    const saveImage = async () => {
        try {
            const userDocRef = doc(firestore, "users", user.id);
            if (selectedFile) {
                const imageRef = ref(storage, `users/image/${user.id}`);
                await uploadString(imageRef, selectedFile, 'data_url');
                try {
                    const downloadURL = await getDownloadURL(imageRef); // Await the Promise
                    await updateDoc(userDocRef, {
                        photoURL: downloadURL,
                    });
                    console.log("Image URL updated successfully in Firebase");
                } catch (error) {
                    console.error("Error updating image URL in Firebase:", error);
                }
            }
            router.reload();
        } catch (error) {
            console.log("saveImage error");
        }
    };


    return (
        <>
            <Modal isOpen={isOpened} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        <Flex
                            justify='space-between'
                            align='center'
                            bg='blue.500'
                            color='white'
                            p={3}
                            borderRadius='4px 4px 0px 0px'
                        >
                            <Text fontSize='10pt' fontWeight={700}>Edit Image</Text>
                            <Icon as={HiOutlineDotsHorizontal}/>
                        </Flex>
                        <Box>
                            <Flex justify={"center"} align={"center"} width={"100%"} >
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
                        <Button colorScheme="blue" onClick={saveImage} mr={2}>
                            Save
                        </Button>
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