import React, { useEffect } from "react";
import { firestore } from "../../../firebase/clientApp";
import ContentLayout from "../../../components/Layout/ContentLayout";
import UserHeader from "../../../components/UserProfile/UserHeader";
import UserImageEditPopup from "../../../components/UserProfile/UserImageEditPopup";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import useUser from "../../../hooks/useUser";
import { Post } from "../../../state/postState";
import { User, userState } from "../../../state/userState";
import { useSetRecoilState } from "recoil";
import UserNotFound from "../../../components/UserProfile/userNotfound";

const UserPage: React.FC = () => {
    const router = useRouter();
    const {
        setUserStateValue,
        userStateValue,
    } = useUser();


    const fetchUser = async (uid: string) => {
        try {
            const userDocRef = doc(firestore, "users", uid);
            const userDoc = await getDoc(userDocRef);
            console.log(userDoc);
            const userData = userDoc.data() as User;
            setUserStateValue((prev) => ({
                ...prev,
                selectedUser: { id: userDoc.id,photoURL: userDoc.id, ...userDoc.data() } as User,
            }));


        } catch (error) {
            console.log("fetchPost error", error);
        }
    };

    useEffect(() => {
        // const current_user = getAuth();
        // console.log("current_user",current_user.currentUser?.uid)
        const { uid } = router.query;
        console.log("query:", uid);

        if (uid && ! userStateValue.selectedUser) {
            console.log("fetching is processing")
            fetchUser(uid as string);
        }
        console.log("selected User ", userStateValue.selectedUser);

    }, [router.query, userStateValue.selectedUser]);

    return (
        <ContentLayout>
            <>
                {!userStateValue.selectedUser && <UserNotFound/>}
                {userStateValue.selectedUser && <UserHeader user={userStateValue.selectedUser} />}
            </>
            <>
                {/* Additional components or content */}
            </>
        </ContentLayout>
    );
};

export default UserPage;