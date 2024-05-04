import React, { useState } from "react";
import { Flex, Image } from "@chakra-ui/react";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";

import Searchbar from "./Searchbar";
import Accountbar from "./Accountbar/Accountbar";
import Channelbar from "./Channelbar/Channelbar";
import useChannelBar from "../../hooks/useChannelBar";
import { defaultMenuItem } from "../../state/channelMenuState";

// Navbar component
const Navbar: React.FC = () => {
    const [user, isLoading, serverError] = useAuthState(auth);
    const { onSelectMenuItem } = useChannelBar();

    const [targetChannel, setTargetChannel] = useState("");

    return (
        <Flex bg="#1A83A8" height="44px" padding="6px 12px">
            <Flex align="center">
                {/* Logo */}
                <Image
                    src="/images/icon.png"
                    height="30px"
                    onClick={() => {
                        onSelectMenuItem(defaultMenuItem);
                    }}
                />
                {/* Application name */}
                <Image
                    src="/images/name.svg"
                    height="18px"
                    display={{ base: "none", md: "unset" }}
                    onClick={() => {
                        onSelectMenuItem(defaultMenuItem);
                    }}
                />
            </Flex>

            {/* Render Channelbar if user exists */}
            {user && <Channelbar />}

            {/* Render Searchbar */}
            <Searchbar user={user} />

            {/* Render Accountbar */}
            <Accountbar user={user} />
        </Flex>
    );
};

export default Navbar;