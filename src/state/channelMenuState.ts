import {atom} from "recoil";
import {IconType} from "react-icons";
import {TiHome} from "react-icons/ti";

export type ChannelMenuItem = {
    displayText: string;
    link: string;
    icon: IconType;
    iconColor: string;
    imageURL?: string;
}
interface ChannelMenuState{
    isOpened: boolean;
    selectedItem: ChannelMenuItem;
}

export const defaultMenuItem: ChannelMenuItem ={
    displayText: 'Home',
    link: '/',
    icon: TiHome,
    iconColor: 'black'
};

export const defaultMenuState: ChannelMenuState = {
    isOpened: false,
    selectedItem: defaultMenuItem,
};

export const channelMenuState = atom<ChannelMenuState> ({
    key: "channelMenuState",
    default: defaultMenuState,
});