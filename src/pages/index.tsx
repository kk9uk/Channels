import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import ContentLayout from "../components/Layout/ContentLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import { useCallback, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import usePosts from "../hooks/usePosts";
import { Post } from "../state/postState";
import PostLoader from "../components/Posts/PostLoader";
import { Stack } from "@chakra-ui/react";
import PostItem from "../components/Posts/PostItem";
import CreatePostLink from "../components/Channel/CreatePostLink";
import useChannelBar from "../hooks/useChannelBar";
import { channelState } from "../state/channelState";
import { useRecoilValue } from "recoil";
import useChannelState from "../hooks/useChannelState";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { postStateVal, setPostStateVal, onPushPull, onSelect, onDelete } =
    usePosts();
  const { channelStateValue } = useChannelState();

  const buildNonUserFeed = useCallback(async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("numPushPull", "desc"),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const post = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateVal((prev) => ({
        ...prev,
        postList: post as Post[],
      }));
      console.log(postStateVal);
    } catch (error) {
      console.log("buildNoUserHomeFeed error: ", error);
    }
    setLoading(false);
  }, [setPostStateVal]);

  // const buildUserFeed = useCallback(async () => {
  //   setLoading(true);
  //   console.log(channelStateValue.channels.length);
    // try {
    //   if (channelStateValue.channels.length === 0) {
    //     // if user has no subscribed channels
    //     buildNonUserFeed();
    //   } else {
    //     // create array of user subscribed channels' names
    //     const userSubscribedChannels = channelStateValue.channels.map(
    //       (channel) => channel.channelName
    //     );
    //     const postQuery = query(
    //       collection(firestore, "posts"),
    //       where("channelName", "in", userSubscribedChannels),
    //       limit(10)
    //     );
    //     const postDocs = await getDocs(postQuery);
    //     const post = postDocs.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     setPostStateVal((prev) => ({
    //       ...prev,
    //       postList: post as Post[],
    //     }));
    //   }
    // } catch (error) {
    //   console.log("first buildUserFeed error: ", error);
    // }
  //   setLoading(false);
  // }, []);

  const getUserPostsPushPull = () => {};

  // useEffect(() => {
  //   if (user && channelStateValue.channelFetched) buildUserFeed();
  // }, [channelStateValue.channelFetched, buildUserFeed]);
   
  useEffect(() => {
    // always start with !user, only fetcg NonUserFeed when loadingUSer is false also
    if (!user && !loadingUser) buildNonUserFeed();
  }, [user, loadingUser, buildNonUserFeed]);

  return (
    <ContentLayout>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateVal.postList.map((post: Post) => (
              <PostItem
                key={post.id}
                post={post}
                isCreator={post.creatorId === user?.uid}
                numPushPull={post.numPushPull}
                onPushPull={onPushPull}
                onDelete={onDelete}
                onSelect={onSelect}
                userPushPostValue={
                  postStateVal.postPushPulls.find(
                    (item) => item.postId === post.id
                  )?.pushPullValue
                }
                isHomePage={true}
              />
            ))}
          </Stack>
        )}
      </>
      <>{/* Recommendations */}</>
    </ContentLayout>
  );
};

export default Home;
