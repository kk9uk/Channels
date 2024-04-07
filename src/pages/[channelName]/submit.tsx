import React from "react";
import ContentLayout from "../../components/Layout/ContentLayout";
import { Box, Text } from "@chakra-ui/react";
import NewPostForm from "../../components/Posts/NewPostForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { useRecoilValue } from "recoil";
import { channelState } from "../../state/channelState";
import useChannelState from "../../hooks/useChannelState";
import ChannelDetails from "../../components/Channel/ChannelDetails";

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  // const channelStateVal = useRecoilValue(channelState);
  const { channelStateValue } = useChannelState();
  // console.log("channel:", channelStateVal);

  return (
    <ContentLayout>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a post</Text>
        </Box>
        {user && channelStateValue.currentChannel && (
          <NewPostForm
            user={user}
            channelName={channelStateValue.currentChannel.channelName}
            channelIconUrl={channelStateValue.currentChannel.iconURL}
          />
        )}
      </>
      <>
        {channelStateValue.currentChannel && (
          <ChannelDetails channel={channelStateValue.currentChannel} />
        )}
      </>
    </ContentLayout>
  );
};

export default SubmitPostPage;
