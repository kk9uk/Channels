import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";

/* Sorry for such poor naming, 'C'hannel serves as a type for objects from channels collection,
 * while 'c'hannel serves as a type for objects from users/<uid>/channels subcollection,
 * fixing this would lead to serious headache, so I just leave it as it is...... */
export interface Channel {
  channelName: string;
  creatorId: string;
  noOfMember: number;
  createdAt: Timestamp;
  iconUrl?: string;
}

export interface channel {
  channelName: string;
  isAdmin?: boolean;
  iconUrl?: string;
}

interface ChannelState {
  channels: channel[];
  currentChannel?: Channel;
  channelFetched: boolean;
}

export const defaultChannel: Channel = {
  channelName: "",
  creatorId: "",
  noOfMember: 0,
  createdAt: Timestamp.now(),
  iconUrl: "",
};

export const defaultChannelState: ChannelState = {
  channels: [],
  currentChannel: defaultChannel,
  channelFetched: false,
};

export const channelState = atom<ChannelState>({
  key: "channelState",
  default: defaultChannelState,
});
