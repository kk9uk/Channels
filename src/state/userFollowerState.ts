import { atom } from "recoil";

export type UserFollower = {
    followerId: string;
}

interface UserFollowerState {
    selectedUserFollower: UserFollower | null;
    followerList: UserFollower[];
}

export const userFollowerState = atom<UserFollowerState>({
    key: "userFollowerState",
    default: {
        selectedUserFollower: null,
        followerList: [],
    },
});