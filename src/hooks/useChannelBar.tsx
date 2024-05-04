import React, { Component, useEffect } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { ChannelMenuItem, channelMenuState, defaultMenuItem } from '../state/channelMenuState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { channelState } from '../state/channelState';

const useChannelBar = () => {
    // Recoil state and router setup
    const [directoryState, setDirectoryState] = useRecoilState(channelMenuState);
    const router = useRouter();

    // Accessing channelState value from Recoil
    const channelStateVal = useRecoilValue(channelState);

    // Function to handle selecting a menu item
    const onSelectMenuItem = (menuItem: ChannelMenuItem) => {
        // Update the selected menu item in directoryState
        setDirectoryState((prev) => ({
            ...prev,
            selectedMenuItem: menuItem,
        }));

        // Change the route based on the selected menu item
        router?.push(menuItem.link);

        // Toggle the menu open/close if it was already open
        if (directoryState.isOpened) {
            toggleMenuOpen();
        }
    };

    // Function to toggle the menu open/close state
    const toggleMenuOpen = () => {
        setDirectoryState((prev) => ({
            ...prev,
            isOpened: !directoryState.isOpened,
        }));
    };

    // useEffect hook to update the selected menu item when the currentChannel changes
    useEffect(() => {
        const { currentChannel } = channelStateVal;

        // Check if a currentChannel is set
        if (currentChannel?.channelName) {
            // Update the selected menu item with the currentChannel information
            setDirectoryState((prev) => ({
                ...prev,
                selectedMenuItem: {
                    displayText: `${currentChannel.channelName}`,
                    link: `${currentChannel.channelName}`,
                    icon: FaQuestionCircle,
                    iconColor: 'blue.500',
                    imageURL: currentChannel.iconUrl,
                },
            }));
            return;
        }
        // If no currentChannel is set, revert to the default menu item
        setDirectoryState((prev) => ({
            ...prev,
            selectedMenuItem: defaultMenuItem,
        }));
    }, [channelStateVal.currentChannel]);

    return { directoryState, onSelectMenuItem, toggleMenuOpen };
};

export default useChannelBar;