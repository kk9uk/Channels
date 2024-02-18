import React from "react";
import
{
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Flex,
    Text
}
from "@chakra-ui/react";

import { useRecoilState } from "recoil";
import { authPopupState } from "../../../state/authPopupState";

import AuthPopupInput from "./AuthPopupInput";
import AuthPopupOAuth from "./AuthPopupOAuth";

const AuthPopup: React.FC = () => {
    const [popupState, setPopupState] = useRecoilState(authPopupState);

    const onClose = () => {
        setPopupState(prev => ({
            ...prev,
            isOpened: false
        }));
    };

    return (
        <>
            <Modal isOpen={popupState.isOpened} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>{popupState.view}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        pb={6}
                    >
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            width="70%"
                        >
                            <AuthPopupOAuth/>
                            <Text color="gray.500" fontWeight={700}>OR</Text>
                            <AuthPopupInput/>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
};

export default AuthPopup;
