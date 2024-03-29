import React, {useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase/clientApp";
import ContentLayout from "../../../components/Layout/ContentLayout";
import UserHeader from "../../../components/UserProfile/UserHeader";
import UserImageEditPopup from "../../../components/UserProfile/UserImageEditPopup";



const UserPage: React.FC = () => {
    const [isOpened, setIsOpened] = useState(false);

    // @ts-ignore
    return (

        <>
            {/*<UserImageEditPopup isOpened={true} onClose={() => setIsOpened(false)}/>*/}
            <>
                <UserHeader/>
            </>

        </>
    );

}

export default UserPage;