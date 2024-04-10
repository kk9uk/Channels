import React, { useEffect } from "react";
import { firestore } from "../../../firebase/clientApp";
import ContentLayout from "../../../components/Layout/ContentLayout";
import UserHeader from "../../../components/UserProfile/UserHeader";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import { useRouter } from "next/router";
import useUser from "../../../hooks/useUser";
import { User } from "../../../state/userState";
import UserNotFound from "../../../components/UserProfile/userNotfound";

const UserPage: React.FC = () => {
    const router = useRouter();
    const {
        setUserStateValue,
        userStateValue,
    } = useUser();


    const fetchUser = async (uid: string) => {
        try {
            const userRef = collection(firestore, "users");
            const querySnapshot = await getDocs(query(userRef, where("uid", "==", uid)));
            // Get the current user's document from Firestore
            console.log("current_user: ", uid);
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                console.log("userData: ",userData)
                setUserStateValue((prev) => ({
                    ...prev,
                    selectedUser: { id: doc.id, ...doc.data() } as User,
                }));
            });
            // const userDocRef = doc(firestore, "users", uid);
            // const userDoc = await getDoc(userDocRef);
            // console.log(userDoc);
            // const userData = userDoc.data() as User;
            // console.log("userData: ",userData)
            // setUserStateValue((prev) => ({
            //     ...prev,
            //     selectedUser: { id: userDoc.id, ...userDoc.data() } as User,
            // }));
            console.log("userStateValue",userStateValue.selectedUser)


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