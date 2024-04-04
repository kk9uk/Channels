import React, {useState} from "react";
import { Flex, Image } from "@chakra-ui/react";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";

import Searchbar from "./Searchbar";
import Accountbar from "./Accountbar/Accountbar";
import Channelbar from "./Channelbar/Channelbar";

const Navbar: React.FC = () => {
    const [user, isLoading, serverError] = useAuthState(auth);
    const [targetChannel, setTargetChannel] = useState("");
    return (
        <Flex bg="#1A83A8" height="44px" padding="6px 12px">
            <Flex align="center">
                <Image src="/images/icon.png" height="30px"/>
                <Image src="/images/name.svg" height="18px" display={{ base: "none", md: "unset" }}/>
            </Flex>
            {user && <Channelbar/>}
            <Searchbar
                user={user}
            />
            <Accountbar user={user}/>
        </Flex>
    );
};

export default Navbar;
