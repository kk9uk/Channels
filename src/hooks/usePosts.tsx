import React, { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { Post, PostPushPull, postState } from "../state/postState";
import { deleteObject, ref } from "firebase/storage";
import { auth, firestore, storage } from "../firebase/clientApp";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { channelState } from "../state/channelState";
import { useRouter } from "next/router";
import { authPopupState } from "../state/authPopupState";

const usePosts = () => {
  const [user] = useAuthState(auth);
  const [postStateVal, setPostStateVal] = useRecoilState(postState);
  const channelStateValue = useRecoilValue(channelState);
  const router = useRouter();
  const { channelName } = router.query;
  const setAuthPopupState = useSetRecoilState(authPopupState);

  const onPushPull = async (
    event: React.MouseEvent<SVGAElement, MouseEvent>,
    post: Post,
    pushPull: number,
    channelName: string
  ) => {
    event.stopPropagation();
    // check user credential => if not, open auth modal
    if (!user) {
      setAuthPopupState({ isOpened: true, view: "Login" });
      return;
    }
    try {
      // Push => pushPull = 1, Pull => pushPull = -1
      let pushPullChange = pushPull;
      const batch = writeBatch(firestore);

      // create copies of state, to avoid state mutation
      const updatedPost = { ...post };
      const updatedPosts = [...postStateVal.postList];
      let updatedPostPushPulls = [...postStateVal.postPushPulls];

      const { numPushPull } = post;
      const existingPushPull = postStateVal.postPushPulls.find(
        (pushPull) => pushPull.postId === post.id
      );

      // new PushPull
      if (!existingPushPull) {
        // create a new pushPull document
        const newPushPullRef = doc(
          collection(firestore, "users", `${user?.uid}/postPushPull`)
        );

        const newPushPull: PostPushPull = {
          id: newPushPullRef.id,
          postId: post.id!,
          channelName,
          pushPullValue: pushPull, // 1 or -1
        };

        batch.set(newPushPullRef, newPushPull);

        // add/subtract 1 to/from the post's numPushPull
        updatedPost.numPushPull = numPushPull + pushPull;
        updatedPostPushPulls = [...updatedPostPushPulls, newPushPull];
      }
      // removing existing pushPull
      else {
        const postPushPullRef = doc(
          firestore,
          "users",
          `${user?.uid}/postPushPull/${existingPushPull.id}`
        );

        // undo pushPost action
        if (existingPushPull.pushPullValue === pushPull) {
          pushPullChange *= -1;
          updatedPost.numPushPull = numPushPull - pushPull;
          // remove the existing pushPull
          updatedPostPushPulls = updatedPostPushPulls.filter(
            (pushPull) => pushPull.id !== existingPushPull.id
          );
          // delete the postPushPull document
          batch.delete(postPushPullRef);
        }
        // flipping pushPost action
        else {
          pushPullChange = 2 * pushPull;
          updatedPost.numPushPull = numPushPull + 2 * pushPull;
          const pushPullIdx = postStateVal.postPushPulls.findIndex(
            (pushPull) => pushPull.id === existingPushPull.id
          );

          if (pushPullIdx !== -1) {
            updatedPostPushPulls[pushPullIdx] = {
              ...existingPushPull,
              pushPullValue: pushPull,
            };
          }
          batch.update(postPushPullRef, { pushPullValue: pushPull });
        }
      }

      if(postStateVal.selectedPost){
        setPostStateVal((prev) =>({
          ...prev,
          selectedPost: updatedPost,
        }));
      }
      // update the post document
      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, { numPushPull: numPushPull + pushPullChange });

      await batch.commit();

      // update the state
      setPostStateVal((prev) => ({
        ...prev,
        postList: prev.postList.map((item) =>
          item.id === updatedPost.id ? updatedPost : item
        ),
        postPushPulls: updatedPostPushPulls,
      }));
    } catch (error) {
      console.log("On PushPull error", error);
    }
    console.log("onPushPull called");
  };

  const onSelect = (post: Post) => {
    setPostStateVal((prev) => ({
      ...prev,
      selectedPost: post,

    }));
  router.push(`/${post.channelName}/comments/${post.id}`);
  };

  const onDelete = async (post: Post): Promise<boolean> => {
    try {
      // Check image exist, if yes => delete
      if (post.imageURL) {
        const imgRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imgRef);
      }

      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);

      setPostStateVal((prev) => ({
        ...prev,
        posts: prev.postList.filter((item) => item.id !== post.id),
      }));

      return true;
    } catch (error) {
      return false;
    }
  };

  const onTweet = async (post: Post) => {
    setPostStateVal((prev) => ({
      ...prev,
      selectedPost: post,
      isTweet: true,
    }));
  };
  // console.log("postStateVal", postStateVal);

  const getChannelPostPushPull = useCallback(
    async (channelName: string) => {
      const postPushPullsQuery = query(
        collection(firestore, "users", `${user?.uid}/postPushPull`),
        where("channelName", "==", channelName)
      );
  
      const postPushPullDocs = await getDocs(postPushPullsQuery);
      const postPushPulls = postPushPullDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setPostStateVal((prev) => ({
          ...prev,
          postPushPulls: postPushPulls as PostPushPull[],
        }));
    }, [setPostStateVal, user]
  )

  useEffect(() => {
    if (!user?.uid || !channelName) return;{
      getChannelPostPushPull(channelName?.toString());
    }
  }, [user, channelName, getChannelPostPushPull]);

  useEffect(() => {
    if (!user) {
      setPostStateVal((prev) => ({
        ...prev,
        postPushPulls: [],
      }));
    }
  }, [setPostStateVal, user]);

  return {
    postStateVal,
    setPostStateVal,
    onPushPull,
    onSelect,
    onDelete,
    onTweet,
  };
};

export default usePosts;
