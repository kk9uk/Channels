import React from "react";

import { Flex, Image } from "@chakra-ui/react";
import Searchbar from "./Searchbar";

const Navbar: React.FC = () => {
    return (
        <Flex bg="#1A83A8" height="44px" padding="6px 12px">
            <Flex align="center">
                <Image src="/images/icon.png" height="30px"/>
                <Image src="/images/name.svg" height="18px" display={{ base: "none", md: "unset" }}/>
            </Flex>
            <Searchbar/>
        </Flex>
    );
};

export default Navbar;
