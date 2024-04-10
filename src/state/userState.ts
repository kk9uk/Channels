import { atom } from "recoil";

export type User = {
    id: string;
    uid: string;
    displayName?: string | null | undefined;
    email?: string;
    photoURL?: string;
    introduction?: string;
    isAdmin?: boolean
};

interface UserState {
    selectedUser: User | null;
    userList: User[];
}

export const userState = atom<UserState>({
    key: "userState",
    default: {
        selectedUser: null,
        userList: [],
    },
});

