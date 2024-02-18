import React from "react";
import { Flex } from "@chakra-ui/react";

import Auth from "./Auth";

const Accountbar: React.FC = () => (
    <>
        <Flex justify="center" align="center">
            <Auth/>
        </Flex>
    </>
);

export default Accountbar;
