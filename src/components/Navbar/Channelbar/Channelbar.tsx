import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Menu,
    MenuButton,
    MenuList,
    Flex,
    Icon,
    Text, Image
} from "@chakra-ui/react";
import {TiMessageTyping} from "react-icons/ti";

import DropdownMenu from "./DropdownMenu";
import useChannelBar from "../../../hooks/useChannelBar";
import {IMAGES_MANIFEST} from "next/constants";


const ChannelBar: React.FC = () => {
    const {directoryState, onSelectMenuItem, toggleMenuOpen} = useChannelBar()
    return (
        <Menu isOpen={directoryState.isOpened}>
        {/*// <Menu>*/}
            <MenuButton
                cursor="pointer"
                borderRadius={4}
                ml={2}
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                onClick={toggleMenuOpen}
            >
                {/*//TODO: nothing change after switching */}
                <Flex align="center">
                    {directoryState.selectedItem.imageURL ?(
                        <Image
                            src={directoryState.selectedItem.imageURL}
                            borderRadius= "full"
                            boxSize="24px"
                            mr={2}
                        />
                        ) : (
                        <Icon color="#FFFFFF" fontSize={24} mr={{ sm: 0, md: 1 }} as={TiMessageTyping}/>
                    )}
                    <Flex align="center">
                        <Flex display={{ sm: "none", md: "flex" }}>
                            <Text fontWeight={600} color="#FFFFFF" fontSize="10pt">
                                {/*//TODO: nothing change after switching */}
                                {directoryState.selectedItem.displayText}
                            </Text>
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

export default ChannelBar;
