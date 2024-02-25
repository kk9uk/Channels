import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Menu,
    MenuButton,
    MenuList,
    Flex,
    Icon,
    Text
} from "@chakra-ui/react";
import { TiHome } from "react-icons/ti";

import DropdownMenu from "./DropdownMenu";

const Channelbar: React.FC = () => {
    return (
        <Menu>
            <MenuButton
                cursor="pointer"
                borderRadius={4}
                ml={2}
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
            >
                <Flex align="center">
                    <Flex align="center">
                        <Icon color="#FFFFFF" fontSize={24} mr={{ sm: 0, md: 1 }} as={TiHome}/>
                        <Flex display={{ sm: "none", md: "flex" }}>
                            <Text fontWeight={600} color="#FFFFFF" fontSize="10pt">Home</Text>
                        </Flex>
                    </Flex>
                    <ChevronDownIcon color="#FFFFFF"/>
                </Flex>
            </MenuButton>
            <MenuList>
                <DropdownMenu/>
            </MenuList>
        </Menu>
    );
};

export default Channelbar;
