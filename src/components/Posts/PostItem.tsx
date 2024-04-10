import React, { useCallback, useEffect, useState } from "react";
import { Post, postState } from "../../state/postState";
import {
  Alert,
  AlertIcon,
  CloseButton,
  Flex,
  Icon,
  Image,
  Link,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import moment from "moment";
import { BsChat, BsDot } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter } from "next/router";
import { FaQuestionCircle } from "react-icons/fa";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { useRecoilState } from "recoil";

type PostItemProps = {
  post: Post;
  isCreator: boolean;
  numPushPull?: number;
  onSelect?: (post: Post) => void;
  onPushPull: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    pushPull: number,
    channelName: string
  ) => void;
  onDelete: (post: Post) => Promise<boolean>;
  onTweet: (post: Post) => void;
  userPushPostValue?: number;
  isHomePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  isCreator,
  numPushPull,
  onPushPull,
  onSelect,
  onDelete,
  // onTweet,
  userPushPostValue,
  isHomePage,
}) => {
  const [postStateVal, setPostStateVal] = useRecoilState(postState);
  const [loadingImg, setLoadingImg] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const singlePostPage = !onSelect;
  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);

    try {
      const successMsg = await onDelete(post);
      if (!successMsg) {
        throw new Error("Failure: Delete Post");
      }

      console.log("Delete success");
      if (singlePostPage) {
      }
      router.push(`/${post.channelName}`);
    } catch (error: any) {
      setError(error.message);
    }

    setLoadingDelete(false);
  };
  const handleTweet = async () => {
    try {
        // const setPostSuccess = onTweet;
        setPostStateVal((prev) => ({
            ...prev,
            selectedPost: post,
            isTweet: true,
        }));
        router.push(`/${post.channelName}/submit`);
    } catch (error: any) {
        setError(error.message);
    }
};

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={singlePostPage ? "white" : "gray.300"}
      borderRadius={singlePostPage ? "4px 4px 0px 0px" : "4px"}
      _hover={{ borderColor: singlePostPage ? "none" : "gray.500" }}
      cursor={singlePostPage ? "unset" : "pointer"}
      // onClick={() => onSelect && onSelect(post)}
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
          as={
            userPushPostValue === 1
              ? IoArrowUpCircleSharp
              : IoArrowUpCircleOutline
          }
          color={numPushPull === 1 ? "brand.100" : "gray.400"}
          fontSize={22}
          onClick={(event) => onPushPull(event, post, 1, post.channelName)}
          cursor="pointer"
        />
        <Text fontSize="9pt">{post.numPushPull}</Text>
        <Icon
          as={
            userPushPostValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={numPushPull === -1 ? "#4379ff" : "gray.400"}
          fontSize={22}
          onClick={(event) => onPushPull(event, post, -1, post.channelName)}
          cursor="pointer"
        />
      </Flex>
      <Flex direction="column" width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mr={2}>{error}</Text>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            {isHomePage && (
              <>
                {post.channelIconUrl ? (
                  <Image
                    src={post.channelIconUrl}
                    alt="channel-icon"
                    borderRadius={"full"}
                    boxSize={"18px"}
                    mr={2}
                  />
                ) : (
                  <Icon
                    as={FaQuestionCircle}
                    fontSize={"18px"}
                    color="brand.100"
                    mr={2}
                  />
                )}
                <Link href={`./${post.channelName}`}>
                  <Text
                    fontWeight={600}
                    mr={1}
                    _hover={{ textDecoration: "underline" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    c/{post.channelName}
                  </Text>
                </Link>
                <Icon as={BsDot} color={"gray.500"} fontSize={8} />
              </>
            )}

            <Text>
              Posted by {post.creatorName}{" "}
              {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </Stack>

          <Text fontSize={"12pt"} fontWeight={600}>
            {post.title}
          </Text>

          <Text fontSize={"10pt"}>{post.body}</Text>

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
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} onClick={() => onSelect && onSelect(post)}/>
            <Text fontSize="9pt" onClick={() => onSelect && onSelect(post)}>Comment</Text>
          </Flex>

          {/* Tweet button */}
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            onClick={handleTweet}
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Tweet</Text>
          </Flex>

          {/* Archive */}
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Archive</Text>
          </Flex>

          {/* Delete if user is creator */}
          {isCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PostItem;
