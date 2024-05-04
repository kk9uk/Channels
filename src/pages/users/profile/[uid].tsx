import React, { useCallback, useEffect, useState } from "react";
import { firestore } from "../../../firebase/clientApp";
import ContentLayout from "../../../components/Layout/ContentLayout";
import UserHeader from "../../../components/UserProfile/UserHeader";
import UserImageEditPopup from "../../../components/UserProfile/UserImageEditPopup";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import useUser from "../../../hooks/useUser";
import { User } from "../../../state/userState";
import UserNotFound from "../../../components/UserProfile/userNotfound";
import { Stack, Text } from "@chakra-ui/react";
import usePosts from "../../../hooks/usePosts";
import PostItem from "../../../components/Posts/PostItem";
import PostLoader from "../../../components/Posts/PostLoader";
import { getAuth } from "firebase/auth";
import { Post } from "../../../state/postState";
import UserPostNotFound from "../../../components/UserProfile/userPostNotFound";

const UserPage: React.FC = () => {
    const router = useRouter();



    const [loading, setLoading] = useState(false);
    const {
        setUserStateValue,
        userStateValue,
    } = useUser();
    const { postStateVal, setPostStateVal, onPushPull, onSelect, onDelete, onTweet } = usePosts();
    const currentUser = getAuth().currentUser?.uid;
    const { uid } = router.query;

    // Fetches the user data from Firestore based on the uid
    const fetchUser = async (uid: string) => {
        try {
            const userRef = collection(firestore, "users");
            const querySnapshot = await getDocs(query(userRef, where("uid", "==", uid)));
            // Get the current user's document from Firestore
            console.log("current_user: ", uid);
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                console.log("userData: ",userData)
                setUserStateValue((prev) => ({
                    ...prev,
                    selectedUser: { id: doc.id, ...doc.data() } as User,
                }));
            });
            // const userDocRef = doc(firestore, "users", uid);
            // const userDoc = await getDoc(userDocRef);
            // console.log(userDoc);
            // const userData = userDoc.data() as User;
            // console.log("userData: ",userData)
            // setUserStateValue((prev) => ({
            //     ...prev,
            //     selectedUser: { id: userDoc.id, ...userDoc.data() } as User,
            // }));
            console.log("userStateValue",userStateValue.selectedUser)


        } catch (error) {
            console.log("fetchPost error", error);
        }
    };

    // Fetches the posts created by the user
    const buildUserProfileFeed = useCallback(async () => {
        setLoading(true);
        try {
            const postQuery = query(
                collection(firestore, "posts"),
                where("creatorId", "==", uid),
                orderBy("createdAt", "desc"),
                limit(6)
            );
            console.log(uid);
            const postDocs = await getDocs(postQuery);
            const post = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            console.log("Posts:", post)
            setPostStateVal((prev) => ({
              ...prev,
              postList: post as Post[],
            }));
        } catch (error) {
            console.log("buildNoUserHomeFeed error: ", error);
        }
        setLoading(false);
    }, [setPostStateVal, router.query]);

    useEffect(() => {
        console.log("useEffect is running on properly")
        console.log("query:", uid);
        console.log("userStateValue.selectedUser:", userStateValue.selectedUser);
        if (uid) {
            fetchUser(uid as string);
            buildUserProfileFeed();
        }
    }, [router.query]);

    // Fetches the user data and builds the user's profile feed when the selected user changes or when the current user changes
    useEffect(() => {
        if (uid && !userStateValue.selectedUser) {
            fetchUser(uid as string);
            buildUserProfileFeed();
        }
    }, [userStateValue.selectedUser, buildUserProfileFeed, uid, fetchUser, currentUser]);

    return (
        <ContentLayout>
            <>
                {loading ? (
                    <PostLoader />
                ) : (
                    <Stack>
                        {postStateVal.postList.length === 0 && (
                            <UserPostNotFound />
                        )}

                        {postStateVal.postList.map((post) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                isCreator={false}
                                numPushPull={post.numPushPull}
                                onPushPull={onPushPull}
                                onDelete={onDelete}
                                onSelect={onSelect}
                                onTweet={onTweet}
                                userPushPostValue={
                                    postStateVal.postPushPulls.find((item) => item.postId === post.id)?.pushPullValue
                                }
                            />
                        ))}
                    </Stack>
                )}
            </>

            <>
                {!userStateValue.selectedUser && <UserNotFound />}
                {userStateValue.selectedUser && <UserHeader user={userStateValue.selectedUser} />}
            </>
        </ContentLayout>
    );
};

export default UserPage;