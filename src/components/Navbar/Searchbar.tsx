import React from "react";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import {firestore} from "../../firebase/clientApp";

type SearchbarProp = {
    user: User;
};

type SearchbarProps = {
    user?: User | null;
    targetChannel: string;
    setTargetChannel: (value: string) => void;
};


const Searchbar: React.FC<SearchbarProps> = ({
                                                     user,
                                                     targetChannel,
                                                     setTargetChannel,
                                                     }) => {
    const dbRef = collection(firestore, "channels");
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetChannel(e.target.value);
        // console.log("Target Channel:", e.target.value);
    };
    return (
        <Flex flexGrow={1} mr={user ? 0 : 2} align="center">
            <InputGroup ml={2}>
                <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" mb={1} />
                </InputLeftElement>
                <Input
                    border="none"
                    height="34px"
                    placeholder="What's the right channel?"
                    fontSize="10pt"
                    _placeholder={{ color: "gray.300" }}
                    _hover={{
                        bg: "#FFFFFF",
                        border: "1px solid",
                        borderColor: "#CDF6F9"
                    }}
                    _focus={{
                        outline: "none",
                        border: "1px solid",
                        borderColor: "#CDF6F9"
                    }}
                />
            </InputGroup>
        </Flex>
    );
};

export default Searchbar;