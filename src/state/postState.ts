import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Post = {
  id: string;
  channelName: string;
  channelIconUrl?: string;
  creatorId: string;
  creatorName: string;
  title: string;
  body: string;
  numComments: number;
  numPushPull: number;
  imageURL?: string;
  channelImageURL?: string;
  createdAt: Timestamp;
};

export type PostPushPull = {
  id: string;
  postId: string;
  channelName: string;
  pushPullValue: number;
};
interface PostState {
  selectedPost: Post | null;
  postList: Post[];
  postPushPulls: PostPushPull[];
}

const defaultPostState: PostState = {
  selectedPost: null,
  postList: [],
  postPushPulls: [],
};

export const postState = atom<PostState>({
  key: "postState",
  default: defaultPostState,
});
