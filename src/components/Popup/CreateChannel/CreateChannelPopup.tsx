import { FunctionComponent, useState, ChangeEvent } from "react";
import { Box, Button, Divider, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { auth, firestore } from "../../../firebase/clientApp";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

type CreateChannelPopupProp = {
    isOpened: boolean;
    onClose: () => void;
};

const CreateChannelPopup: FunctionComponent<CreateChannelPopupProp> = ({ isOpened, onClose }) => {
    const [channelName, setChannelName] = useState("");
    const [charsRemaining, setCharsRemaining] = useState(21);
    const [error, setError] = useState("");
    const [user] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 21) return;
        setChannelName(event.target.value);
        setCharsRemaining(21 - event.target.value.length);
    };

    const onClick = async () => {
        if (error) setError("");
        const SPECIAL_CHAR = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (SPECIAL_CHAR.test(channelName) || channelName.length < 3) {
            setError("Channel name must be between 3-21 characters, and can only contain letters, numbers, or underscores");
            return;
        }

        setIsLoading(true);

        try {
            const channelDocRef = doc(firestore, "channels", channelName);

            await runTransaction(firestore, async (transaction) => {
                const channelDoc = await transaction.get(channelDocRef);
                if (channelDoc.exists()) {
                    throw new Error(`Sorry, ${channelName} is taken. Try another.`);
                }

                transaction.set(channelDocRef, {
                    creatorId: user?.uid,
                    createdAt: serverTimestamp(),
                    noOfMember: 1
                });

                transaction.set(doc(firestore, `users/${user?.uid}/channels`, channelName),
                                {
                                    channelName: channelName,
                                    isAdmin: true,
                                    iconUrl: ""
                                }
                );
            });
        } catch (error: any) {
            console.log("CreateChannelPopup: ", error);
            setError(error.message);
        };

        setIsLoading(false);
    };

    return (
        <>
            <Modal isOpen={isOpened} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader
                        display="flex"
                        flexDirection="column"
                        fontSize={15}
                        padding={3}
                        ml={1}
                    >
                        Create a Channel
                    </ModalHeader>
                    <Box pl={3} pr={3}>
                        <Divider/>
                        <ModalCloseButton/>
                        <ModalBody
                            display="flex"
                            flexDirection="column"
                            padding="10px 0px"
                        >
                            <Text fontWeight={600} fontSize={15} ml={1}>
                                Channel Name
                            </Text>
                            <Text fontSize={11} color="gray.500" ml={1} mb={1}>
                                Anyone can view, post, and comment to this channel
                            </Text>
                            <Input value={channelName} size="sm" onChange={onChange} ml={1} mb={1}/>
                            <Text fontSize="9pt" color={charsRemaining === 0 ? "red" : "gray.500"} ml={1}>{charsRemaining} characters remaining</Text>
                            <Text fontSize="9pt" color="red" pt={1}>{error}</Text>
                        </ModalBody>
                    </Box>
                    <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
                        <Button height="30px" onClick={onClick} isLoading={isLoading}>
                            Create Channel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreateChannelPopup;
