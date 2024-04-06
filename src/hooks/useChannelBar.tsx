import React, {Component, useEffect} from 'react';
import {FaQuestionCircle} from "react-icons/fa";
import {ChannelMenuItem, channelMenuState, defaultMenuItem} from "../state/channelMenuState";
import {useRecoilState, useRecoilValue} from "recoil";
import {useRouter} from "next/router";
import {channelState} from "../state/channelState";


const useChannelBar = () => {
    const [directoryState, setDirectoryState] =
        useRecoilState(channelMenuState);
    const router = useRouter();

    const channelStateVal = useRecoilValue(channelState);

    const onSelectMenuItem = (menuItem: ChannelMenuItem) => {
        setDirectoryState((prev) => ({
            ...prev,
            selectedMenuItem: menuItem,
        }));

        router?.push(menuItem.link);
        if (directoryState.isOpened) {
            toggleMenuOpen();
        }
    };

    const toggleMenuOpen = () => {
        setDirectoryState((prev) => ({
            ...prev,
            isOpened: !directoryState.isOpened,
        }));
    };
    //Todo: The image can't change after refresh
    // but not sure is that part or original change image not work
    // image have successfully in firestore, however it won't be shown after refresh
    useEffect(() => {
        const { currentChannel } = channelStateVal;

        const existingChannel = channelStateVal.currentChannel;

        if (currentChannel?.channelName) {
            setDirectoryState((prev) => ({
                ...prev,
                selectedMenuItem: {
                    displayText: `${currentChannel.channelName}`,
                    link: `${currentChannel.channelName}`,
                    icon: FaQuestionCircle,
                    iconColor: "blue.500",
                    imageURL: currentChannel.iconURL,
                },
            }));
            return;
        }
        setDirectoryState((prev) => ({
            ...prev,
            selectedMenuItem: defaultMenuItem,
        }));
    }, [channelStateVal.currentChannel]);

    return { directoryState, onSelectMenuItem, toggleMenuOpen };
};

export default useChannelBar;