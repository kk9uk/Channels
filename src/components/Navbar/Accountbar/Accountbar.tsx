import React from "react";
import { Flex, Icon } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";

import { User } from "firebase/auth";

import Auth from "./Auth";
import AuthPopup from "../../Popup/Auth/AuthPopup";
import DropdownMenu from "./DropdownMenu";

type AccountbarProp = {
    user?: User | null;
};

const Accountbar: React.FC<AccountbarProp> = ({ user }) => (
    <>
        <AuthPopup/>
        <Flex justify="center" align="center">
            {user ? <Flex
                        mr={1.5}
                        ml={1.5}
                        padding={1}
                        cursor="pointer"
                        borderRadius={4}
                        _hover={{ bg: "blue.400" }}
                    >
                        <Icon as={GrAdd} fontSize={20} color="#FFFFFF"/>
                    </Flex>
                  : <Auth/>}
            <DropdownMenu user={user}/>
        </Flex>
    </>
);

export default Accountbar;
