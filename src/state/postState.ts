import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Post = {
    channelName: string;
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

interface PostState{
    selectedPost: Post | null;
    postList: Post[];
}

const defaultPostState: PostState = {
    selectedPost: null,
    postList: [],
};

export const postState = atom<PostState>({
    key: "postState",
    default: defaultPostState,
});