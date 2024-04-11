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
  or,
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
import { userFollowerState } from "../state/userFollowerState";
import Recommendations from "../components/Channel/Recommndations";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { postStateVal, setPostStateVal, onPushPull, onSelect, onDelete, onTweet } =
    usePosts();
  const { channelStateValue } = useChannelState();
  const checkFollow = useRecoilValue(userFollowerState);

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

  const buildUserFeed = useCallback(async () => {
    setLoading(true);
    try {
      if (channelStateValue.channels.length === 0) {
        // if user has no subscribed channels
        buildNonUserFeed();
      } else {
        // create array of user subscribed channels' names
        let userSubscribedChannels = channelStateValue.channels.map(
          (channel) => channel.channelName
        );
        let userFollowed = checkFollow.follow.map(
          (item) => item.followerId
        );
        console.log(userFollowed)
        // find posts where channelName is in userSubscribedChannels (channels subscribed by user)
          const postRef = collection(firestore, "posts");
          const channelPostQuery = query(
            postRef,
             where("channelName", "in", userSubscribedChannels)
            ,limit(10)
          );

        const postDocs = await getDocs(channelPostQuery);
        const post = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostStateVal((prev) => ({
          ...prev,
          postList: post as Post[],
        }));
      }
    } catch (error) {
      console.log("first buildUserFeed error: ", error);
    }
    setLoading(false);
  }, [buildNonUserFeed, channelStateValue.channels, setPostStateVal]);

  const getUserPostsPushPull = () => {};

  useEffect(() => {
    if (user && channelStateValue.channelFetched) buildUserFeed();
  }, [channelStateValue.channelFetched, buildUserFeed, user]);
   
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
                onTweet={onTweet}
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
      <>
        <Recommendations />
      </>
    </ContentLayout>
  );
};

export default Home;
