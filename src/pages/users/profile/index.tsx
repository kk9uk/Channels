import React, {useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase/clientApp";
import ContentLayout from "../../../components/Layout/ContentLayout";
import UserHeader from "../../../components/UserProfile/UserHeader";



const UserPage: React.FC = () => {
    const [isOpened, setIsOpened] = useState(false);

    // @ts-ignore
    return (

        <>
            <>
                <UserHeader/>
            </>

        </>
    );

}

export default UserPage;