import React from "react";
import { Flex } from "@chakra-ui/react";

import { useRecoilValue } from "recoil";
import { authPopupState } from "../../../state/authPopupState";

import AuthPopupLogin from "./AuthPopupLogin";
import AuthPopupSignUp from "./AuthPopupSignUp";

const AuthPopupInput: React.FC = () => {
    const popupState = useRecoilValue(authPopupState);

    return (
        <Flex direction="column" align="center" width="100%" mt={4}>
            {popupState.view === "Login" && <AuthPopupLogin/>}
            {popupState.view === "Sign Up" && <AuthPopupSignUp/>}
        </Flex>
    );
};

export default AuthPopupInput;
