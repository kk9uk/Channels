import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Channel } from "../../state/channelState";
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase/clientApp";
import usePosts from "../../hooks/usePosts";
import { Post } from "../../state/postState";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack } from "@chakra-ui/react";
import PostLoader from "./PostLoader";

type PostsProps = {
    channelData: Channel;
};

const Posts:React.FC<PostsProps> = ({ channelData }) => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const { postStateVal, setPostStateVal,
            onPushPull, onSelect, onDelete, onTweet } = usePosts();

    const getPosts = async () => {
        try {
            setLoading(true);

            const postsQuery = query(
                collection(firestore, 'posts'),
                where("channelName", "==", channelData.channelName),
                orderBy("createdAt", "desc")
            );
            const postDocs = await getDocs(postsQuery);

            const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPostStateVal((prev) => ({
                ...prev,
                postList: posts as Post[],
            }));
            console.log(postStateVal);
            console.log("posts", posts);

        } catch (error: any) {
            console.log("Fetch Posts error", error.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        getPosts();
    }, [channelData]);


    return(
        <>
            {loading ? (
                <PostLoader/>
            ) : (
            <Stack>
                {postStateVal.postList.map((post: Post, index) => (
                    <PostItem
                        key={post.id}
                        post={post} 
                        isCreator={user?.uid === post.creatorId}
                        numPushPull={postStateVal.postPushPulls.find(
                            (pushPull) => pushPull.postId === post.id)?.pushPullValue}
                        onPushPull={onPushPull}
                        onSelect={onSelect}
                        onDelete={onDelete}
                        onTweet={onTweet}
                        userPushPostValue={
                            postStateVal.postPushPulls.find(
                            (item) => item.postId === post.id)?.pushPullValue}
                    />
                ))}
            </Stack>
            )}
        </>
    )
};

export default Posts;