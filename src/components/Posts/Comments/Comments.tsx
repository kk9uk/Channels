import React, {useEffect, useState} from "react";
import {Post} from "../../../state/postState";
import {User} from "firebase/auth";
import {Box, Flex} from "@chakra-ui/react";
import CommentInput from "./CommentInput";
import {
    collection, doc, increment, serverTimestamp, Timestamp,
    writeBatch,
} from "firebase/firestore";
import {firestore} from "../../../firebase/clientApp";
import {Comment} from "postcss";
import {channel} from "node:diagnostics_channel";

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
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    const onCreateComment = async (commentText: string) => {
        // update post numOfComments +1
        setCreateLoading(true);
        try {
            const batch = writeBatch(firestore);
            // create a comment doc
            const commentDocRef = doc(collection(firestore,'comments'))
            const newComment: Comment ={
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

            const postDocRef = doc(firestore, "posts", selectPost?.id!);
            batch.update(postDocRef,{
                numberOfComments: increment(1),
            })

            await batch.commit()

            setCommentText("");
            setComments(prev => [newComment, ...prev])
        } catch (error){
            console.log("onCreateComment error", error);
        }
        setCreateLoading(false);

        // update client recoil state
    };
    const onDeleteComment = async (comment: string) => {
        // create a comment doc
        // update post numOfComments -11

        // update client recoil state
    };
    const getPostComments = async () => {};

    useEffect(() => {
        getPostComments();
    }, []);
    return (
        <Box bg="white" borderRadius="0px 0px 4px 4px " p={2}>
            <Flex
                direction={"column"}
                pl={10}
                pr={4}
                mb={6}
                fontSize={"10pt"}
                width={"100%"}
            >
                <CommentInput commentText={commentText}
                              setCommentText={setCommentText}
                              user={user}
                              createLoading={createLoading}
                              onCreateComment={onCreateComment}/>
            </Flex>
        </Box>
    )
}
export default Comments;