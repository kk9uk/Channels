import React, { useState } from "react";
import { Post } from "../../state/postState";
import { Flex, Icon, Image, Skeleton, Stack, Text } from "@chakra-ui/react";
import { IoArrowDownCircleOutline, 
        IoArrowDownCircleSharp, 
        IoArrowRedoOutline, 
        IoArrowUpCircleOutline, 
        IoArrowUpCircleSharp, 
        IoBookmarkOutline} from "react-icons/io5";
import moment from "moment";
import { BsChat } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";

type PostItemProps = {
    post: Post;
    isCreator: boolean;
    numPushPull?: number;
    onSelect: () => void;
    onPushPull: () => {};
    onDelete: () => {};
};

const PostItem: React.FC<PostItemProps> = ({
    post,
    isCreator,
    numPushPull,
    onPushPull,
    onSelect,
    onDelete,
}) => {
    const [loadingImg, setLoadingImg] = useState(true);

    return (
        <Flex
            border = "1px solid" 
            bg = "white"
            borderColor="gray.300"
            borderRadius={4}
            _hover={{ borderColor: "gray.500"}}
            cursor="pointer"
            onClick={onSelect}
        >
            <Flex 
                direction="column"
                align="center"
                bg="gray.100"
                p={2}
                width="40px"
                borderRadius={4}
            >
                <Icon 
                    as={numPushPull === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
                    color={numPushPull === 1 ? "brand.100" : "gray.400"}
                    fontSize={22}
                    onClick={onPushPull}
                    cursor="pointer"
                />
                <Text fontSize="9pt">{post.numPushPull}</Text>
                <Icon 
                    as={numPushPull === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
                    color={numPushPull === -1 ? "#4379ff" : "gray.400"}
                    fontSize={22}
                    onClick={onPushPull}
                    cursor="pointer"
                />
            </Flex>
            <Flex direction="column" width="100%">
                <Stack spacing={1} p="10px">
                    <Stack
                        direction="row"
                        spacing={0.6}
                        align="center"
                        fontSize="9pt"
                    >
                        <Text>
                            Posted by {post.creatorName} {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
                        </Text>
                    </Stack>

                    <Text fontSize={"12pt"} fontWeight={600}>
                        {post.title}
                    </Text>

                    {post.imageURL && (
                        <Flex justify="center" align="center" p={2}>
                            {loadingImg && (
                                <Skeleton height="200px" width="100%" borderRadius={4}/>
                            )}
                            <Image 
                                src={post.imageURL} 
                                maxHeight="460px" 
                                alt="Post Image" 
                                display={loadingImg ? "none" : "unset"}
                                onLoad={() => setLoadingImg(false)}/>
                        </Flex>
                    )}

                </Stack>

                <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
                    {/* number of comments */}
                    <Flex 
                        align='center' 
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        cursor="pointer"
                    >
                        <Icon as={BsChat} mr={2}/>
                        <Text fontSize="9pt">{post.numComments}</Text>
                    </Flex>
                    
                    {/* Tweet button */}
                    <Flex 
                        align='center' 
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        cursor="pointer"
                    >
                        <Icon as={IoArrowRedoOutline} mr={2}/>
                        <Text fontSize="9pt">Tweet</Text>
                    </Flex>
                    
                    {/* Archive */}
                    <Flex 
                        align='center' 
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        cursor="pointer"
                    >
                        <Icon as={IoBookmarkOutline} mr={2}/>
                        <Text fontSize="9pt">Archive</Text>
                    </Flex>

                    {/* Delete if user is creator */}
                    {isCreator && (
                        <Flex 
                            align='center' 
                            p="8px 10px"
                            borderRadius={4}
                            _hover={{ bg: "gray.200" }}
                            cursor="pointer"
                            onClick={onDelete}
                        >
                            <Icon as={AiOutlineDelete} mr={2}/>
                            <Text fontSize="9pt">Delete</Text>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default PostItem;