import React, { useState } from "react"; 
import { UserFollower } from "../state/userFollowerState";
import { auth, firestore } from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authPopupState } from "../state/authPopupState";
import { doc, writeBatch } from "firebase/firestore";
import { User } from "../state/userState";
import { useRouter } from "next/router";

const useFollower = () => {
    const [user] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(false);
    const setAuthPopupState = useSetRecoilState(authPopupState);

    const router = useRouter();
    const onFollowOrUnfollow = (userFollow: UserFollower, isFollow: boolean) => {
        if (!user) {
            setAuthPopupState({isOpened: true, view: "Login"});
            return;
        }

        setIsLoading(true);
        if (isFollow) {
            Unfollow();
            return;
        }
        Follow();
    };

    const Follow = async () => {
        try {
            const batch = writeBatch(firestore);
            const newFollower: UserFollower = {
                followerId: router.query as unknown as string,
            };
            batch.set(
                doc(firestore, 
                    `users/${user?.uid}/user_follow`,
                    router.query as unknown as string),
                newFollower
            );

            await batch.commit();
            
        } catch (error: any) {
            console.log("userFollow: ", error);
        }
        setIsLoading(false);
    };

    const Unfollow = async () => {
        try {
            const batch = writeBatch(firestore);
            batch.delete(
                doc(firestore, 
                    `users/${user?.uid}/user_follow`, 
                    router.query as unknown as string));
            await batch.commit();
        } catch (error: any) {
            console.log("userFollow: ", error);
        }
        setIsLoading(false);
    };

    return {
        onFollowOrUnfollow,
        isLoading,
    };
};

export default useFollower;