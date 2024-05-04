import {
    Box,
    Button,
    Flex,
    Icon,
    Image,
    Skeleton,
    SkeletonCircle,
    Stack,
    Text,
} from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import { firestore } from "../../firebase/clientApp";
import { Channel } from "../../state/channelState";
import useChannelState from "../../hooks/useChannelState";

type RecommendationsProps = {};

const Recommendations: React.FC<RecommendationsProps> = () => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(false);
    const {
        channelStateValue,
        onJoinOrLeaveChannel,
        isLoading,
    } = useChannelState();

    const getChannelRecommendations = async () => {
        setLoading(true);
        try {
            // Query the "channels" collection in Firestore, order by "noOfMember" in descending order, and limit to 5 documents
            const channelQuery = query(
                collection(firestore, "channels"),
                orderBy("noOfMember", "desc"),
                limit(5)
            );
            const channelDocs = await getDocs(channelQuery);
            const channels = channelDocs.docs.map((doc) => ({
                channelName: doc.id,
                ...doc.data(),
            })) as Channel[];
            console.log("HERE ARE COMS", channels);

            setChannels(channels);
        } catch (error: any) {
            console.log("getChannelRecommendations error", error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Retrieve channel recommendations when the component mounts
        getChannelRecommendations();
    }, []);

    return (
        <Flex
            direction="column"
            bg="white"
            borderRadius={4}
            cursor="pointer"
            border="1px solid"
            borderColor="gray.300"
        >
            <Flex
                align="flex-end"
                color="white"
                p="6px 10px"
                bg="blue.500"
                height="70px"
                borderRadius="4px 4px 0px 0px"
                fontWeight={600}
                // bgImage="url(/images/icon.png)"
                backgroundSize="cover"
                bgGradient="linear-gradient(to bottom, rgba(0.7, 0.3, 0, 0), rgba(0, 0, 0.05, 0.23))"
            >
                Top Channels
            </Flex>
            <Flex direction="column">
                {loading ? (
                    <Stack mt={2} p={3}>
                        {/* Skeleton placeholders for loading state */}
                        <Flex justify="space-between" align="center">
                            <SkeletonCircle size="10" />
                            <Skeleton height="10px" width="70%" />
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <SkeletonCircle size="10" />
                            <Skeleton height="10px" width="70%" />
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <SkeletonCircle size="10" />
                            <Skeleton height="10px" width="70%" />
                        </Flex>
                    </Stack>
                ) : (
                    <>
                        {channels.map((item, index) => {
                            // Check if the channel is already joined by the user
                            const isJoined = !!channelStateValue.channels.find(
                                (channel) => channel.channelName === item.channelName
                            );
                            return (
                                <Link key={item.channelName} href={`/${item.channelName}`}>
                                    <Flex
                                        position="relative"
                                        align="center"
                                        fontSize="10pt"
                                        borderBottom="1px solid"
                                        borderColor="gray.200"
                                        p="10px 12px"
                                        fontWeight={600}
                                    >
                                        <Flex width="80%" align="center">
                                            <Flex width="15%">
                                                <Text mr={2}>{index + 1}</Text>
                                            </Flex>
                                            <Flex align="center" width="80%">
                                                {item.iconUrl ? (
                                                    <Image
                                                        borderRadius="full"
                                                        boxSize="28px"
                                                        src={item.iconUrl}
                                                        mr={2}
                                                    />
                                                ) : (
                                                    <Icon
                                                        as={FaReddit}
                                                        fontSize={30}
                                                        color="brand.100"
                                                        mr={2}
                                                    />
                                                )}
                                                <span
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >{`${item.channelName}`}</span>
                                            </Flex>
                                        </Flex>
                                        <Box position="absolute" right="10px">
                                            {/* Button tojoin or leave the channel */}
                                            <Button
                                                height="22px"
                                                fontSize="8pt"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    onJoinOrLeaveChannel(item, isJoined);
                                                }}
                                                variant={isJoined ? "outline" : "solid"}
                                            >
                                                {isJoined ? "Joined" : "Join"}
                                            </Button>
                                        </Box>
                                    </Flex>
                                </Link>
                            );
                        })}
                    </>
                )}
            </Flex>
        </Flex>
    );
};

export default Recommendations;