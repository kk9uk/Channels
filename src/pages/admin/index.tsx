import React, { useEffect, useState } from 'react';
import ContentLayout from "../../components/Layout/ContentLayout";
import AdminHeader from "../../components/Adminpage/adminHeader";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/clientApp";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { User, userState } from "../../state/userState";
import useUser from "../../hooks/useUser";
import AdminDeny from "../../components/Adminpage/adminDeny";

const UserTable = () => {
    const current_user = getAuth().currentUser?.uid;
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const { setUserStateValue, userStateValue } = useUser();
    const [userAuthState] = useAuthState(auth);

    const fetchUserData = async () => {
        if (!current_user) {
            console.log("current_user is undefined");
            setIsAdmin(false);
        }
        if (current_user) {
            try {
                const userRef = collection(firestore, "users");
                const querySnapshot = await getDocs(query(userRef, where("uid", "==", current_user)));

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    setUserStateValue((prev) => ({
                        ...prev,
                        selectedUser: { id: doc.id, ...doc.data() } as User,
                    }));
                });

                if (userStateValue.selectedUser) {
                    // Check if the selected user is an admin
                    if (userStateValue.selectedUser.isAdmin) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } else {
                    setIsAdmin(false);
                }

                console.log("isAdmin: ", isAdmin);
                console.log("userStateValue.selectedUser: ", userStateValue.selectedUser);
                console.log("userStateValue: ", userStateValue);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [router.query, userAuthState]);

    return (
        <ContentLayout>
            {isAdmin ? (
                <>
                    <AdminHeader />
                    {/* Render admin page content */}
                </>
            ) : (
                <AdminDeny/>
            )}
            <>
            </>
        </ContentLayout>
    );
};

export default UserTable;