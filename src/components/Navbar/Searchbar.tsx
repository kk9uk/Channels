import React, { useState, useEffect } from "react";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";

type Channel = {
    id: string;
    name: string;
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
    const [channelList, setChannelList] = useState<Channel[]>([]);
    const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);

    useEffect(() => {

        const fetchChannels = async () => {
            const querySnapshot = await getDocs(collection(firestore, "channels"));
            const channels = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
            }));
            setChannelList(channels);
        };

        fetchChannels();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setTargetChannel(inputValue);

        const filtered = channelList.filter((channel) =>
            channel.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredChannels(filtered);
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
                        borderColor: "#CDF6F9",
                    }}
                    _focus={{
                        outline: "none",
                        border: "1px solid",
                        borderColor: "#CDF6F9",
                    }}
                    value={targetChannel}
                    onChange={handleInputChange}
                />
            </InputGroup>
            {filteredChannels.map((channel) => (
                <div key={channel.id}>{channel.name}</div>
            ))}
        </Flex>
    );
};

export default Searchbar;