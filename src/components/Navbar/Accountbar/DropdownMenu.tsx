import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Icon,
    Flex,
    MenuDivider
} from "@chakra-ui/react";
import { User, signOut } from "firebase/auth";
import { VscAccount } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { auth } from "../../../firebase/clientApp";
import { authPopupState } from "../../../state/authPopupState";
import { channelState } from "../../../state/channelState";

type DropdownMenuProp = {
    user?: User | null;
};

const DropdownMenu: React.FC<DropdownMenuProp> = ({ user }) => {
    const setAuthPopupState = useSetRecoilState(authPopupState);
    const resetChannelState = useResetRecoilState(channelState);

    const logout = async () => {
        await signOut(auth);
        resetChannelState();
    };

    return (
        <Menu>
            <MenuButton
                cursor="pointer"
                borderRadius={4}
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
            >
                <Flex align="center">
                    <Flex align="center">
                        <Icon
                            fontSize={24}
                            mr={1}
                            color="gray.300"
                            as={VscAccount}
                        />
                    </Flex>
                    <ChevronDownIcon color="#FFFFFF"/>
                </Flex>
            </MenuButton>
            <MenuList>
                {user ? (
                    <>
                        <MenuItem
                            fontSize="10pt"
                            fontWeight={700}
                            _hover={{ bg: "blue.500", color: "#FFFFFF" }}
                        >
                            <Flex align="center">
                                <Icon fontSize={20} mr={2} as={CgProfile}/>
                                Profile
                            </Flex>
                        </MenuItem>
                        <MenuDivider/>
                        <MenuItem
                            fontSize="10pt"
                            fontWeight={700}
                            _hover={{ bg: "blue.500", color: "#FFFFFF" }}
                            onClick={logout}
                        >
                            <Flex align="center">
                                <Icon fontSize={20} mr={2} as={MdOutlineLogin}/>
                                Logout
                            </Flex>
                        </MenuItem>
                    </>
                )
                      : (
                    <>
                        <MenuItem
                            fontSize="10pt"
                            fontWeight={700}
                            _hover={{ bg: "blue.500", color: "#FFFFFF" }}
                            onClick={() => setAuthPopupState({ isOpened: true, view: "Login" })}
                        >
                            <Flex align="center">
                                <Icon fontSize={20} mr={2} as={MdOutlineLogin}/>
                                Login / Sign Up
                            </Flex>
                        </MenuItem>
                    </>
                )}
            </MenuList>
        </Menu>
    );
};

export default DropdownMenu;
