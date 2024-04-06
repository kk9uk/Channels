import React, { FunctionComponent, useState } from "react";
import CreateChannelPopup from "../../Popup/CreateChannel/CreateChannelPopup";
import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import { channelState } from "../../../state/channelState";
import { FaQuestionCircle } from "react-icons/fa";
import ChannelListItem from "./ChannelListItem";

const DropdownMenu: FunctionComponent = () => {
    const [isOpened, setIsOpened] = useState(false);
    const myChannels = useRecoilValue(channelState).channels;

    return (
        <>
            <CreateChannelPopup isOpened={isOpened} onClose={() => setIsOpened(false)} />
            {myChannels.find((item) => item.isAdmin) && (
                <Box pl={2} mb={1}>
                    <Text pl={2} mb={1} fontSize="10px" fontWeight={500} color="gray.500">
                        Admin
                    </Text>

                </Box>
            )}
            {myChannels
                .filter((item) => item.isAdmin)
                .map((channel) => (
                    <ChannelListItem
                        key={channel.channelName}
                        displayText={`${channel.channelName}`}
                        link={`/${channel.channelName}`}
                        icon={FaQuestionCircle}
                        iconColor="brand.100"
                        imageURL={channel.iconURL}
                    />
                ))}
            <Box pl={2} mb={1}>
                <Text pl={2} mb={1} fontSize="10px" fontWeight={500} color="gray.500">
                    Joined Channels
                </Text>
            </Box>
            {myChannels.map((channel) => (
                <ChannelListItem
                    key={channel.channelName}
                    icon={FaQuestionCircle}
                    displayText={channel.channelName}
                    link={`/${channel.channelName}`}
                    iconColor='blue.500'
                    imageURL={channel.iconURL}
                />
            ))}
            <MenuItem
                width="100%"
                fontSize="10pt"
                _hover={{ bg: "gray.100" }}
                onClick={() => setIsOpened(true)}
            >
                <Flex align="center">
                    <Icon fontSize={20} mr={2} as={GrAdd} />
                    Create Channel
                </Flex>
            </MenuItem>
        </>
    );
};

export default DropdownMenu;