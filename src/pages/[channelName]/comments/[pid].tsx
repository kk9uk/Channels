import React, {useEffect} from "react";
import ContentLayout from "../../../components/Layout/ContentLayout";
import PostItem from "../../../components/Posts/PostItem";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "../../../firebase/clientApp";
import usePosts from "../../../hooks/usePosts";
import {useRouter} from "next/router";
import {doc, getDoc} from "firebase/firestore";
import {Post} from "../../../state/postState";
import useChannelState from "../../../hooks/useChannelState";
import ChannelDetails from "../../../components/Channel/ChannelDetails";
import Comments from "../../../components/Posts/Comments/Comments";
import {User} from "firebase/auth";

const PostPage: React.FC = () => {
    const [user] = useAuthState(auth);
    const {postStateVal, setPostStateVal, onDelete, onPushPull, onTweet} = usePosts();
    const router = useRouter();
    const { channelStateValue} = useChannelState();

    const fetchPost = async(postId :string) => {
        try{
            const postDocRef = doc(firestore, 'posts', postId);
            const postDoc = await getDoc(postDocRef);
            setPostStateVal((prev) => ({
                ...prev,
                selectedPost : {id: postDoc.id, ...postDoc.data()} as Post,
            }));
        } catch (error) {
            console.log("fetchPost error", error)
        }
    };

    useEffect(() => {
        const {pid} = router.query;

        if (pid && ! postStateVal.selectedPost){
            fetchPost(pid as string);
        }
    }, [router.query, postStateVal.selectedPost])
    return (
        <ContentLayout>
            <>
                {postStateVal.selectedPost && (
                    <PostItem
                        post={postStateVal.selectedPost}
                        isCreator={user?.uid === postStateVal.selectedPost?.creatorId}
                        onDelete={onDelete}
                        onPushPull={onPushPull}
                        onTweet={onTweet}
                        numPushPull={
                            postStateVal.postPushPulls.find(
                                (item) => item.postId === postStateVal.selectedPost?.id
                            )?.pushPullValue
                        }


                    />
                )}
                {/*comments */}
                <Comments user={user as User}
                          selectPost={postStateVal.selectedPost}
                          channelName={postStateVal.selectedPost?.channelName as string}/>


            </>
            <>
                {channelStateValue.currentChannel && (
                    <ChannelDetails channel={channelStateValue.currentChannel}/>
                )}
            </>
        </ContentLayout>
    );
}

export default PostPage