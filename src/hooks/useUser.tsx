import { useEffect, useState } from "react";
import {User, userState} from "../state/userState";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {firestore} from "../firebase/clientApp";
import {useRecoilState} from "recoil";
import {useRouter} from "next/router";

const useUser = () => {
    const [userStateValue, setUserStateValue] = useRecoilState(userState);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const router = useRouter();

    const getUserData = async (uid: string) => {
        try {
            const userDocRef = doc(firestore, 'users', uid);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data() as User;
            setUserStateValue((prev) => ({
                ...prev,
                ...userData,
            }));
        } catch (error) {
            console.log("getData", error);
        }
    };

    useEffect(() => {
        const {uid} = router.query

        if (uid && ! userStateValue.selectedUser){
            getUserData(uid as string);
        }
    }, [router.query, userStateValue.selectedUser]);

    return { selectedUser, getUserData, setSelectedUser,setUserStateValue, userStateValue};
};

export default useUser;