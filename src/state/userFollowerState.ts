import { atom } from "recoil";

export interface UserFollower {
    followerId: string;
}

interface UserFollowerState {
    follow: UserFollower[];
}

export const defaultUserFollowerState: UserFollowerState = {
    follow: [],
};

export const userFollowerState = atom<UserFollowerState>({
    key: "userFollowerState",
    default: defaultUserFollowerState,
});