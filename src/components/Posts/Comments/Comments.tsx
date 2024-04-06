import React, { useEffect, useState } from "react";
import { Post, postState } from "../../../state/postState";
import { User } from "firebase/auth";
import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import CommentInput from "./CommentInput";
import {
  collection,
  doc, getDocs,
  increment, orderBy, query,
  serverTimestamp,
  Timestamp, where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../../../firebase/clientApp";
import CommentItem, { Comment } from "./CommentItem";
import { useSetRecoilState } from "recoil";


type CommentsProps = {
  user: User;
  selectPost: Post | null;
  channelName: string;
};

const Comments: React.FC<CommentsProps> = ({
                                             user,
                                             selectPost,
                                             channelName,
                                           }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState('');
  const setPostStateVal = useSetRecoilState(postState);

  const onCreateComment = async (commentText: string) => {
    // update post numOfComments +1
    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);
      // create a comment doc
      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        channelName,
        postId: selectPost?.id!,
        postTitle: selectPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      const postDocRef = doc(firestore, "posts", selectPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      //TODO: the num of comment is not working
      setPostStateVal((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost!,
          numberOfComments: prev.selectedPost!.numComments! + 1,
        },
      }));
    } catch (error) {
      console.log("onCreateComment error", error);
    }
    setCreateLoading(false);
  };

  const onDeleteComment = async (comment: Comment) => {
    // create a comment doc
    // update post numOfComments -1
    // update client recoil state
    setLoadingDeleteId(comment.id);
    try {
      // if (!comment.id) throw "Comment has no ID";
      const batch = writeBatch(firestore);
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      batch.update(doc(firestore, "posts", comment.postId), {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      setPostStateVal((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numComments! - 1,
        } as Post,
        postUpdateRequired: true,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error: any) {
      console.log("Error delete comment", error.message);

    }
    setLoadingDeleteId('');
  };

  const getPostComments = async () => {
    try {
      const commentsQuery = query(
          collection(firestore, "comments"),
          where("postId", "==", selectPost?.id),
          orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log("getPostComments error", error.message);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if(!selectPost) return;
    console.log("HERE IS SELECTED POST", selectPost?.id);

    getPostComments();
  }, [selectPost]);

  return (
      <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
        <Flex
            direction="column"
            pl={10}
            pr={4}
            mb={6}
            fontSize="10pt"
            width="100%"
        >
          <CommentInput
              commentText={commentText}
              setCommentText={setCommentText}
              user={user}
              createLoading={createLoading}
              onCreateComment={onCreateComment}
          />
        </Flex>
        <Stack spacing={6} p={2}>
          {fetchLoading ? (
              <>
                {[0, 1, 2].map((item) => (
                    <Box key={item} padding="6" bg="white">
                      <SkeletonCircle size="10" />
                      <SkeletonText mt="4" noOfLines={2} spacing="4" />
                    </Box>
                ))}
              </>
          ) : (
              <>
                {comments.length === 0 ? (
                    <Flex
                        direction="column"
                        justify="center"
                        align="center"
                        borderTop="1px solid"
                        borderColor="gray.100"
                        p={20}
                    >
                      <Text fontWeight={700} opacity={0.3}>
                        No Comments Yet
                      </Text>
                    </Flex>
                ) : (
                    comments.map((item: Comment) => (
                        <CommentItem
                            key={item.id}
                            comment={item}
                            onDeleteComment={onDeleteComment}
                            loadingDelete={loadingDeleteId === item.id}
                            userId={user.uid}
                        />
                    ))
                )}
              </>
          )}
        </Stack>
      </Box>
  );
};

export default Comments;