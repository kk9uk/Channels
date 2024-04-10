import React, { useState } from "react"; 
import { UserFollower } from "../state/userFollowerState";
import { auth, firestore } from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authPopupState } from "../state/authPopupState";
import { doc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/router";
import { User } from "../state/userState";

const useFollower = () => {
    const [user] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(false);
    const setAuthPopupState = useSetRecoilState(authPopupState);

    const onFollowOrUnfollow = (selfuser: User, isFollow: boolean) => {
        if (!user) {
            setAuthPopupState({isOpened: true, view: "Login"});
            return;
        }

        console.log(isFollow);
        setIsLoading(true);
        if (isFollow) {
            Unfollow(selfuser);
            return;
        }
        Follow(selfuser);
        console.log(selfuser);
    };

    const Follow = async (target: User) => {
        try {
            const batch = writeBatch(firestore);
            const newFollower: UserFollower = {
                followerId: target.uid,
            };
            batch.set(
                doc(firestore, 
                    `users/${user?.uid}/user_follow`,
                    target.uid),
                newFollower
            );

            await batch.commit();
            
        } catch (error: any) {
            console.log("userFollow: ", error);
        }
        setIsLoading(false);
    };

    const Unfollow = async (target: User) => {
        try {
            const batch = writeBatch(firestore);
            batch.delete(
                doc(firestore, 
                    `users/${user?.uid}/user_follow`, 
                    target.uid));
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