import { FunctionComponent, useState, ChangeEvent } from "react";
import { Box, Button, Divider, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

type CreateChannelPopupProp = {
    isOpened: boolean;
    onClose: () => void;
};

const CreateChannelPopup: FunctionComponent<CreateChannelPopupProp> = ({ isOpened, onClose }) => {
    const [channelName, setChannelName] = useState("");
    const [charsRemaining, setCharsRemaining] = useState(21);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 21) return;
        setChannelName(event.target.value);
        setCharsRemaining(21 - event.target.value.length);
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
                        </ModalBody>
                    </Box>
                    <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
                        <Button height="30px" onClick={() => {}}>
                            Create Channel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreateChannelPopup;
