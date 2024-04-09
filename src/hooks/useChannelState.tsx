import { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Channel, channelState, channel } from "../state/channelState";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { authPopupState } from "../state/authPopupState";
import { useRouter } from "next/router";

const useChannelState = () => {
  const [channelStateValue, setChannelStateValue] =
    useRecoilState(channelState);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerError, setServerError] = useState("");
  const [user] = useAuthState(auth);
  const setAuthPopupState = useSetRecoilState(authPopupState);
  const router = useRouter();

  const onJoinOrLeaveChannel = (channel: Channel, isJoined: boolean) => {
    if (!user) {
      setAuthPopupState({ isOpened: true, view: "Login" });
      return;
    }

    setIsLoading(true);
    if (isJoined) {
      leaveChannel(channel.channelName);
      return;
    }
    joinChannel(channel);
  };

  const joinChannel = async (channel: Channel) => {
    try {
      const batch = writeBatch(firestore);
      const newChannel: channel = {
        channelName: channel.channelName,
        isAdmin: user?.uid === channel.creatorId,
        iconUrl: channel.iconUrl || "",
      };
      batch.set(
        doc(firestore, `users/${user?.uid}/channels`, channel.channelName),
        newChannel
      );

      batch.update(doc(firestore, "channels", channel.channelName), {
        noOfMember: increment(1),
      });

      await batch.commit();

      setChannelStateValue((prev) => ({
        ...prev,
        channels: [...prev.channels, newChannel],
      }));
    } catch (error: any) {
      console.log("useChannelState: ", error);
      setServerError(error.message);
    }
    setIsLoading(false);
  };

  const leaveChannel = async (channelName: string) => {
    try {
      const batch = writeBatch(firestore);
      batch.delete(doc(firestore, `users/${user?.uid}/channels`, channelName));
      batch.update(doc(firestore, "channels", channelName), {
        noOfMember: increment(-1),
      });
      await batch.commit();
      setChannelStateValue((prev) => ({
        ...prev,
        channels: prev.channels.filter(
          (item) => item.channelName !== channelName
        ),
      }));
    } catch (error: any) {
      console.log("useChannelState: ", error);
      setServerError(error.message);
    }
    setIsLoading(false);
  };

  const getChannels = async () => {
    setIsLoading(true);
    try {
      const channelDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/channels`)
      );
      const channels = channelDocs.docs.map((doc) => ({ ...doc.data() }));
      setChannelStateValue((prev) => ({
        ...prev,
        channels: channels as channel[],
        channelFetched: true,
      }));
    } catch (error: any) {
      console.log("useChannelState: ", error);
      setServerError(error.message);
    }
    setIsLoading(false);
  };

  const getChannelData = async (channelName: string) => {
    try {
      const channelDocRef = doc(firestore, "channels", channelName);
      const channelDoc = await getDoc(channelDocRef);

      setChannelStateValue((prev) => ({
        ...prev,
        currentChannel: {
          channelName: channelDoc.id,
          ...channelDoc.data(),
        } as Channel,
      }));
    } catch (error) {
      console.log("getChannelData", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    getChannels();
  }, [user]);

  useEffect(() => {
    const { channelName } = router.query;

    if (channelName && !channelStateValue.currentChannel) {
      getChannelData(channelName as string);
    }
  }, [router.query, channelStateValue.currentChannel]);
  return {
    channelStateValue,
    onJoinOrLeaveChannel,
    isLoading,
  };
};

export default useChannelState;
