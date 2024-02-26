import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Channel } from "../../state/channelState";
import { firestore } from "../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";

import ChannelNotFound from "../../components/Channel/ChannelNotFound";
import ChannelHeader from "../../components/Channel/ChannelHeader";
import ContentLayout from "../../components/Layout/ContentLayout";

type ChannelPageProp = {
    channel: Channel;
}

const ChannelPage: React.FC<ChannelPageProp> = ({ channel }) => {
    if (!channel) {
        return <ChannelNotFound/>;
    }

    return (
        <>
            <ChannelHeader channel={channel}/>
            <ContentLayout>
                <>
                    <div>Left</div>
                </>
                <>
                    <div>Right</div>
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
