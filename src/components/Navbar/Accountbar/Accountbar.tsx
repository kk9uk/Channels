import React from "react";
import { Flex } from "@chakra-ui/react";

import Auth from "./Auth";
import AuthPopup from "../../Popup/Auth/AuthPopup";

const Accountbar: React.FC = () => (
    <>
        <AuthPopup/>
        <Flex justify="center" align="center">
            <Auth/>
        </Flex>
    </>
);

export default Accountbar;
