import React from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase/clientApp";
import ContentLayout from "../../../components/Layout/ContentLayout";
import UserHeader from "../../../components/UserProfile/UserHeader";



const UserPage: () => void = () => {
    const [user] = useAuthState(auth);

    // @ts-ignore
    return (
        <>
            <UserHeader/>
            <ContentLayout>
                <>
                    <div>left</div>
                </>
                <>
                    <div>Right</div>
                </>
            </ContentLayout>
        </>
    );

}

export default UserPage;