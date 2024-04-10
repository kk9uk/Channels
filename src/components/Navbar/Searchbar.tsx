import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    MenuList,
    Menu,
    MenuItem,
    MenuButton,
    Image,
    Text, Icon,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { useDisclosure } from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";
import { MenuGroup } from "@chakra-ui/react";
import { FaQuestionCircle } from 'react-icons/fa';

type Channel = {
    id: string;
    iconUrl?: string;
};

type User_ = {
    name: string;
    iconUrl?: string;
    uid?: string;
    displayName?:string
};

type SearchbarProps = {
    user?: User | null;
};


const Searchbar: React.FC<SearchbarProps> = ({ user }) => {
    const [channelList, setChannelList] = useState<string[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User_[]>([]);

    const [targetChannel, setTargetChannel] = useState("");
    const [targetUser, setTargetUser] = useState("");

    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter()


    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'users'));
            const userData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(userData);
        };

        fetchUsers();
    }, [router.query]);

    const handleChannelClick = (channelId: string) => {
        router.push(`/${channelId}`);
    };

    const handleUserClick = (uid: string) => {
        router.push(`/users/profile/${uid}`);
    };

    useEffect(() => {
        const fetchChannels = async () => {
            const querySnapshot = await getDocs(collection(firestore, "channels"));
            const channels = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setChannelList(channels);
        };

        fetchChannels();
    }, [router.query]);

    useEffect(() => {
        const filtered = channelList.filter((channel) =>
            channel.id.toLowerCase().includes(targetChannel.toLowerCase())
        );
        setFilteredChannels(filtered);
    }, [targetChannel, channelList]);


    useEffect(() => {
        const filtered = users.filter((user) => {
            let displayNameMatch = null
            if(user.displayName){
                displayNameMatch = user.displayName.toLowerCase().includes(targetUser.toLowerCase());
            }
            const emailMatch = user.email.toLowerCase().includes(targetUser.toLowerCase());
            // const displayNameMatch = user?.displayName.toLowerCase().includes(targetUser.toLowerCase());

            if (displayNameMatch) {
                console.log("Display Name:", user.displayName);
            }
            if (emailMatch){
                console.log("Email:", user.email);
            }

            // return displayNameMatch;
            return emailMatch || displayNameMatch;
        });

        setFilteredUsers(filtered);
    }, [targetChannel, users]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setTargetChannel(inputValue);
        setTargetUser(inputValue);
    };

    return (
        <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
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
                        onFocus={onOpen}
                        // onBlur={onClose}
                    />
                </InputGroup>
            </Flex>
            {filteredChannels.length >= 0 && (
                <MenuList width='100%' overflowY="auto">
                    {filteredChannels.length >0 && <Text fontSize='18px' ml={3}>
                        Channel
                    </Text>}
                    {filteredChannels.map((channel) => (
                        <MenuGroup  key={channel.id}>
                            <MenuItem
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                onClick={() => handleChannelClick(channel.id)}
                            >
                                <Flex style={{ display: "flex", alignItems: "center" }}>
                                    {channel.iconUrl && <Image
                                        borderRadius="full"
                                        boxSize="30px"
                                        src={channel.iconUrl}
                                    />}
                                    {!channel.iconUrl && <Icon
                                        as = {FaQuestionCircle}
                                        borderRadius="full"
                                        boxSize="30px"
                                        color='brand.100'
                                    />}
                                    <span style={{ marginLeft: '10px' }}>{channel.id}</span>
                                </Flex>
                            </MenuItem>
                        </MenuGroup>
                    ))}
                    <Text fontSize='18px' ml={3}>
                        User
                    </Text>
                    {filteredUsers.map((user_) => (
                        <MenuGroup  key={user_.displayName}>
                            <MenuItem
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                onClick={() => handleUserClick(user_.uid)}
                            >
                                <Flex style={{ display: "flex", alignItems: "center" }}>
                                    {user_.iconUrl && <Image
                                        borderRadius="full"
                                        boxSize="30px"
                                        src={user_.iconUrl}
                                    />}
                                    {!user_.iconUrl && <Icon
                                        as = {FaQuestionCircle}
                                        borderRadius="full"
                                        boxSize="30px"
                                        color='brand.100'
                                    />}
                                    <span style={{ marginLeft: '10px' }}>{user_.displayName || user_.email}</span>
                                </Flex>
                            </MenuItem>
                        </MenuGroup>
                    ))}

                </MenuList>
            )}
        </Menu>
    );
};

export default Searchbar;