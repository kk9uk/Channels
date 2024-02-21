import { FunctionComponent, useEffect } from "react";
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

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";

import { useRecoilState } from "recoil";
import { authPopupState } from "../../../state/authPopupState";

import AuthPopupInput from "./AuthPopupInput";
import AuthPopupOAuth from "./AuthPopupOAuth";
import AuthPopupResetPassword from "./AuthPopupResetPassword";

const AuthPopup: FunctionComponent = () => {
    const [popupState, setPopupState] = useRecoilState(authPopupState);
    const [user, isLoading, serverError] = useAuthState(auth);

    const onClose = () => {
        setPopupState(prev => ({
            ...prev,
            isOpened: false
        }));
    };

    useEffect(() => {
        if (user) onClose();
    }, [user]);

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
                            {popupState.view === "Login" || popupState.view === "Sign Up" ? (
                                <>
                                    <AuthPopupOAuth/>
                                    <Text color="gray.500" fontWeight={700}>OR</Text>
                                    <AuthPopupInput/>
                                </>
                            ) : <AuthPopupResetPassword/>}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
};

export default AuthPopup;
