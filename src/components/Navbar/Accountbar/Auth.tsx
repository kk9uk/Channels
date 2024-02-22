import React from "react";
import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { authPopupState } from "../../../state/authPopupState";

const Auth: React.FC = () => {
    const setAuthPopupState = useSetRecoilState(authPopupState);

    return (
        <>
            <Button variant="solid"
                height="30px"
                display={{ sm: "none", md: "flex" }}
                width={{ sm: "0px", md: "85px" }}
                mr={2}
                onClick={() => setAuthPopupState({ isOpened: true, view: "Sign Up" })}
            >
                Sign Up
            </Button>
            <Button variant="outline"
                height="30px"
                display={{ base: "none", md: "flex" }}
                width={{ md: "85px" }}
                mr={2}
                onClick={() => setAuthPopupState({ isOpened: true, view: "Login" })}
            >
                Login
            </Button>
        </>
    )
};

export default Auth;
