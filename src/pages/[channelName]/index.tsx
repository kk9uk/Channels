import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { Channel, channelState } from "../../state/channelState";
import { firestore } from "../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";

import ChannelNotFound from "../../components/Channel/ChannelNotFound";
import ChannelHeader from "../../components/Channel/ChannelHeader";
import ContentLayout from "../../components/Layout/ContentLayout";
import CreatePostLink from "../../components/Channel/CreatePostLink";
import Posts from "../../components/Posts/Posts";
import { useSetRecoilState } from "recoil";
import ChannelDetails from "../../components/Channel/ChannelDetails";

type ChannelPageProp = {
    channel: Channel;
}

const ChannelPage: React.FC<ChannelPageProp> = ({ channel }) => {
    const setChannelStateVal = useSetRecoilState(channelState);

    if (!channel) {
        return <ChannelNotFound/>;
    }
    // console.log(channel);

    useEffect(() => {
        setChannelStateVal((prev) => ({
            ...prev,
            currentChannel: channel,
        }));
    }, []);

    return (
        <>
            <ChannelHeader channel={channel}/>
            <ContentLayout>
                <>
                    <CreatePostLink/>
                    <Posts channelData={channel}/>
                </>
                <>
                    <ChannelDetails channel={channel}/>
                </>
            </ContentLayout>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const channelDocRef = doc(firestore, "channels", context.query.channelName as string);
        const channelDoc = await getDoc(channelDocRef);

        return {
            props: {
                channel: channelDoc.exists() ? JSON.parse(
                    safeJsonStringify({ channelName: channelDoc.id, ...channelDoc.data() })
                ) : ""
            }
        };
    } catch (error) {
        console.log("getServerSideProps: ", error);
    }
}

export default ChannelPage;
