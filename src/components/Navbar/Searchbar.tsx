import React, { useState, useEffect } from "react";
import { useRouter} from "next/router";
import {
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    MenuList,
    Menu,
    MenuItem,
    MenuButton
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { useDisclosure } from '@chakra-ui/react'

type Channel = {
    id: string;
};

type SearchbarProps = {
    user?: User | null;
};


const ChannelList: React.FC<{ channels: Channel[] }> = ({ channels }) => {
    const router = useRouter();

    const handleChannelClick = (channelId: string) => {
        router.push(`/${channelId}`);
    };

    return (
        <MenuList mt={2} ml={2}>
            {channels.map((channel) => (
                <MenuItem
                    key={channel.id}
                    onClick={() => handleChannelClick(channel.id)}
                    p={2}
                    mb={2}
                    borderRadius="md"
                    boxShadow="md"
                    bg="white"
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                >
                    {channel.id}
                </MenuItem>
            ))}
        </MenuList>
    );
};
const Searchbar: React.FC<SearchbarProps> = ({ user }) => {
    const [channelList, setChannelList] = useState<Channel[]>([]);
    const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
    const [targetChannel, setTargetChannel] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        const fetchChannels = async () => {
            const querySnapshot = await getDocs(collection(firestore, "channels"));
            const channels = querySnapshot.docs.map((doc) => ({
                id: doc.id,
            }));
            setChannelList(channels);
        };

        fetchChannels();
    }, []);

    useEffect(() => {
        const filtered = channelList.filter((channel) =>
            channel.id.toLowerCase().includes(targetChannel.toLowerCase())
        );
        setFilteredChannels(filtered);
    }, [targetChannel, channelList]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setTargetChannel(inputValue);
    };

    return (
        <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <Flex flexGrow={1} mr={user ? 0 : 2} align="center">
                <MenuButton
                    px={4}
                    py={2}
                    transition='all 0.2s'
                    borderRadius='md'
                    borderWidth='1px'
                    _hover={{ bg: 'gray.400' }}
                    _expanded={{ bg: 'blue.400' }}
                    _focus={{ boxShadow: 'outline' }}
                >                     TODO
                </MenuButton>
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
                        onFocus={() => onOpen()}
                        onBlur={() => onClose()}
                    />
                </InputGroup>



            </Flex>
            {filteredChannels.length > 0 && <ChannelList channels={filteredChannels} />}

        </Menu>

    );
};

export default Searchbar;