import { atom } from "recoil";

export interface AuthPopupState {
    isOpened: boolean;
    view: "Login" | "Sign Up" | "Reset Password";
}

export const authPopupState = atom<AuthPopupState>({
    key: "authPopupState",
    default: {
        isOpened: false,
        view: "Login"
    }
});
