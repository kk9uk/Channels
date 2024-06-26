import React from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { channelState } from "../../state/channelState";
import { Channel } from "../../state/channelState";
import useChannelState from "../../hooks/useChannelState";
import { useRecoilState, useRecoilValue } from "recoil";

type ChannelHeaderProp = {
    channel: Channel;
}

const ChannelHeader: React.FC<ChannelHeaderProp> = ({ channel }) => {
    const { onJoinOrLeaveChannel, isLoading } = useChannelState();
    const channelStateValue = useRecoilValue(channelState);
    const currentChanneIconURL = channelStateValue.currentChannel?.iconUrl;
    const isJoined = !!channelStateValue.channels.find(item => item.channelName === channel.channelName);

    return (
        <Flex direction="column" width="100%" height="146px">
            <Box height="50%" bg="blue.500"/>
            <Flex justify="center" bg="#FFFFFF" flexGrow={1}>
                <Flex width="95%">
                    {currentChanneIconURL ? (
                        <Image 
                            borderRadius="full"
                            boxSize="66px"
                            src={currentChanneIconURL}
                            alt="icon"
                            position="relative"
                            top={-3}
                            color="blue.500"
                            border="4px solid white"
                        />
                    ) : (
                        <Icon
                            as={FaQuestionCircle}
                            fontSize={64}
                            position="relative"
                            top={-3}
                            color="blue.500"
                            border="4px solid white"
                            borderRadius="full"
                        />
                    )}
                    <Flex padding="10px 16px">
                        <Flex direction="column" mr={6}>
                            <Text fontWeight={800} fontSize="16pt">
                                {channel.channelName}
                            </Text>
                        </Flex>
                        <Button
                            variant={isJoined ? "outline" : "solid"}
                            height="30px"
                            pr={6}
                            pl={6}
                            isLoading={isLoading}
                            onClick={() => onJoinOrLeaveChannel(channel, isJoined)}
                        >
                            {isJoined ? "Joined" : "Join"}
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ChannelHeader;
