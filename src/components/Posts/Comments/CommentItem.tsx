import { Box, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React from 'react'
import { FaUserCircle } from 'react-icons/fa';

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
    onDeleteComment: (commentId: string) => void;
    loadingDelete: boolean;
    userId: 
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
                <Icon as={FaUserCircle} />
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
                <Box>
                    {comment.text}
                </Box>
            </Stack>
        </Flex>
    )
}

export default CommentItem;