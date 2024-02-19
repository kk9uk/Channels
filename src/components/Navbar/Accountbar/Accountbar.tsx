import React from "react";
import { Flex, Button } from "@chakra-ui/react";

import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/clientApp";

import Auth from "./Auth";
import AuthPopup from "../../Popup/Auth/AuthPopup";

type AccountbarProp = {
    user: any;
}

const Accountbar: React.FC<AccountbarProp> = ({ user }) => (
    <>
        <AuthPopup/>
        <Flex justify="center" align="center">
            {user ? <Button onClick={() => signOut(auth)}>Logout</Button> : <Auth/>}
        </Flex>
    </>
);

export default Accountbar;
