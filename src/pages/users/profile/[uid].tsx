import React, { useCallback, useEffect, useState } from "react";
import { firestore } from "../../../firebase/clientApp";
import ContentLayout from "../../../components/Layout/ContentLayout";
import UserHeader from "../../../components/UserProfile/UserHeader";
import UserImageEditPopup from "../../../components/UserProfile/UserImageEditPopup";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import useUser from "../../../hooks/useUser";
import { Post } from "../../../state/postState";
import { User, userState } from "../../../state/userState";
import { useSetRecoilState } from "recoil";
import UserNotFound from "../../../components/UserProfile/userNotfound";
import { Stack, Text } from "@chakra-ui/react";
import usePosts from "../../../hooks/usePosts";
import PostItem from "../../../components/Posts/PostItem";
import PostLoader from "../../../components/Posts/PostLoader";

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

    const fetchUser = async (uid: string) => {
        try {
            const userDocRef = doc(firestore, "users", uid);
            const userDoc = await getDoc(userDocRef);
            console.log(userDoc);
            const userData = userDoc.data() as User;
            setUserStateValue((prev) => ({
                ...prev,
                selectedUser: { id: userDoc.id,photoURL: userDoc.id, ...userDoc.data() } as User,
            }));


        } catch (error) {
            console.log("fetchPost error", error);
        }
    };

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
        // const current_user = getAuth();
        // console.log("current_user",current_user.currentUser?.uid)
        console.log("query:", uid);
        if (uid && !userStateValue.selectedUser) {
            console.log("fetching is processing")
            fetchUser(uid as string);
            buildUserProfileFeed();
        }
        console.log("selected User ", userStateValue.selectedUser);

    }, [router.query, userStateValue.selectedUser, buildUserProfileFeed, uid, fetchUser]);

    return (
        <ContentLayout>
            <>
                {!userStateValue.selectedUser && <UserNotFound/>}
                {userStateValue.selectedUser && <UserHeader user={userStateValue.selectedUser} />}
            </>
            <>
            {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateVal.postList.map((post: Post) => (
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
                  postStateVal.postPushPulls.find(
                    (item) => item.postId === post.id
                  )?.pushPullValue
                }
              />
            ))}
          </Stack>
        )}

            </>
        </ContentLayout>
    );
};

export default UserPage;