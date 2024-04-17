import { Box, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React from 'react'
import { FaUserCircle } from 'react-icons/fa';
import {IoArrowDownCircleOutline, IoArrowUpCircleOutline} from "react-icons/io5";

export type Comment = {
    id: string;
    creatorId: string;
    creatorDisplayText: string;
    channelName: string;
    postId: string;
    postTitle: string;
    text: string;
    createdAt?: Timestamp;
}

type CommentItemProps = {
    comment: Comment;
    onDeleteComment: (commentId: Comment) => void;
    loadingDelete: boolean;
    userId?: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    onDeleteComment,
    loadingDelete,
    userId,
}) => {
    return (
        <Flex>
            <Box mr={2}>
                <Icon as={FaUserCircle} fontSize={30} color="gray.300"/>
            </Box>
            <Stack spacing={1}>
                <Stack direction="row" align={"center"} fontSize={"8px"}>
                    <Text>{comment.creatorDisplayText}</Text>
                    {comment.createdAt?.seconds && (
                        <Text color="gray.600">
                        {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
                        </Text>
                    )}
                </Stack>
                <Text fontSize="10pt">{comment.text}</Text>
                <Stack
                    direction="row"
                    align="center"
                    cursor="pointer"
                    fontWeight={600}
                    color="gray.500"
                >
                    <Icon as={IoArrowUpCircleOutline} />
                    <Icon as={IoArrowDownCircleOutline} />
                    {userId === comment.creatorId && (
                        <>
                            <Text fontSize="9pt" _hover={{ color: "blue.500" }}>
                                Edit
                            </Text>
                            <Text
                                fontSize="9pt"
                                _hover={{ color: "blue.500" }}
                                onClick={() => onDeleteComment(comment)}
                            >
                                Delete
                            </Text>
                        </>
                    )}
                </Stack>
            </Stack>


        </Flex>
    )
}

export default CommentItem;