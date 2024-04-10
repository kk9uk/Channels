import React, { useEffect, useState } from "react";
import {Box, Button, Flex, Icon, Input, Text, Textarea} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { FaQuestionCircle } from "react-icons/fa";
import UserImageEditPopup from "./UserImageEditPopup";
import {User, userState} from "../../state/userState";
import UserNotFound from "./userNotfound";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {auth, firestore} from "../../firebase/clientApp";
import {useRouter} from "next/router";
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";
import { useRecoilValue } from "recoil";
import { userFollowerState } from "../../state/userFollowerState";
import useFollower from "../../hooks/useFollower";

type UserHeaderProp = {
    user: User;
}


const UserHeader: React.FC<UserHeaderProp> = ({user}) => {
    const [introduction, setIntroduction] = useState<string>("");
    const [backgroundImage, setBackgroundImage] = useState<string>(
        "https://www.utep.edu/extendeduniversity/utepconnect/blog/june-2019/how-an-online-degree-can-prepare-you-for-remote-positions.jpg"
    );
    const [editMode, setEditMode] = useState<boolean>(false);
    const [textInput, setTextInput] = useState({
        title: "",
        body: "",
    })
    const [isOpened, setIsOpened] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [userAuthState] = useAuthState(auth);
    const router= useRouter();
    // const myFollow = useRecoilValue(userFollowerState).follow;
    const checkFollow = useRecoilValue(userFollowerState);
    const isFollowed = !!checkFollow.follow.find(item => item.followerId === user.uid);
    const currentUser = getAuth().currentUser?.uid;
    console.log(checkFollow);
    console.log(user.id);

    const handleIntroductionChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setIntroduction(event.target.value);
    };

    const enableEditMode = () => {
        setEditMode(true);
    };

    const unableEditMode = () => {
        setEditMode(false)
    }

    const saveIntroduction = () => {
        unableEditMode();

        const userDocRef = doc(firestore, "users", user.id);
        try {
            setDoc(userDocRef, { introduction: introduction }, { merge: true });
            console.log("Introduction updated successfully in Firebase");
        } catch (error) {
            console.error("Error updating introduction in Firebase:", error);
        }


    };

    const editImage = () => {
        //batch.set(doc(firestore, `users/${user?.uid}/image`, image.background), new_background);

    }

    const { onFollowOrUnfollow, isLoading} = useFollower();
    function onFollowOrUnfollowUser(user: User, isFollowed: boolean) {
        //TODO: follow function
    }

    useEffect(() => {
        console.log("useEffect is running")
        if (!introduction && user.introduction){
            setIntroduction(user.introduction)
        }


    }, [router.query]);

    useEffect(() => {
        console.log("useEffect is running")
        setEditMode(false);
        if(!canEdit){
            if (currentUser == user.uid){
                setCanEdit(true);
            }
        }
        if(canEdit){
            if (currentUser != user.uid){
                setCanEdit(false);
            }
        }

    }, [router.query, userAuthState]);

    if (!user.email){
        return <UserNotFound/>
    }

    return (
        //
        <>
            <UserImageEditPopup isOpened={isOpened} onClose={() => setIsOpened(false)} user={user}/>
            {/*<Center color="white" w="100%" position="absolute">*/}
                <Card alignContent="center" justifyContent="center" maxW="sm" top="10" width="100%">
                    <Box
                        position="relative"
                        h={40}
                        bgImage={`url('${backgroundImage}')`}
                        bgSize="cover"
                        bgPosition="center"
                        bgRepeat="no-repeat"
                        boxShadow='dark lg'
                        borderTopRightRadius="10px"
                        borderTopLeftRadius="10px"
                        left={0}
                        right={0}
                        width="100vw"
                        maxWidth="100%"
                    ></Box>
                    <Flex padding="0px 10px" alignContent="flex-start" justifyContent="space-between">
                        {user?.photoURL ? (
                            <Image
                                fontSize={64}
                                position="relative"
                                top={-5}
                                src={user.photoURL}
                                border="4px solid white"
                                borderRadius="full"
                            />
                        ) : (
                            <Icon
                                as={FaQuestionCircle}
                                fontSize={64}
                                position="relative"
                                top={-3}
                                color="blue.500"
                                border="4px solid white"
                                borderRadius="full"
                            />
                        )}
                        <Button
                            variant={isFollowed ? "outline" : "solid"}
                            height="30px"
                            fontSize="12pt"
                            pr={6}
                            pl={6}
                            top={6}
                            // isLoading={isLoading}
                            onClick={() => onFollowOrUnfollow(user, isFollowed)}
                        >
                            {isFollowed ? "Unfollow" : "Follow"}
                        </Button>

                    </Flex>

                    <Flex padding="0px 20px" alignContent="flex-start" justifyContent="space-between">
                        <Box>
                            <Text fontWeight={800} fontSize="16pt">
                                {user ? user.displayName : "Waiting for you to login"}
                            </Text>
                        </Box>
                    </Flex>

                    <Flex padding="0px 20px" alignContent="flex-start" justifyContent="space-between">
                        <Box>
                            {user && (
                                <Text fontWeight={400} fontSize="16pt">
                                    Email: {user.email}
                                </Text>
                            )
                            }
                        </Box>
                    </Flex>

                    <Flex alignContent="flex-start" justifyContent="space-between">
                        <Box w="sm" padding="0px 20px">
                            {editMode && (
                                <Textarea
                                    name="body"
                                    value={introduction}
                                    onChange={handleIntroductionChange}
                                    fontSize={"10pt"}
                                    placeholder="Here to start your introduction"
                                    _placeholder={{ color: "gray.500" }}
                                    _focus={{
                                        outline: "none",
                                        bg: "white",
                                        border: "1px solid",
                                        borderColor: "black",
                                    }}
                                    size='sm'
                                />
                            )}
                            {!editMode && (
                                <Flex width={"800px"}>
                                    <Text>
                                        {introduction}
                                    </Text>

                                </Flex>
                            )}
                        </Box>
                    </Flex>
                    <Flex padding="10px 16px" alignContent="flex-start" justifyContent="left">
                        {editMode && (
                            <>
                                <Flex flexDirection="column">
                                    <Button
                                        marginRight="4"
                                        height="30px"
                                        fontSize="12pt"
                                        pr={6}
                                        pl={6}
                                        onClick={saveIntroduction}
                                    >
                                        Save
                                    </Button>
                                </Flex>
                                <Flex flexDirection="column">
                                    <Button
                                        marginRight="4"
                                        height="30px"
                                        fontSize="12pt"
                                        pr={6}
                                        pl={6}
                                        onClick={() => setIsOpened(true)}
                                    >
                                        Edit your image
                                    </Button>
                                </Flex>
                            </>

                        )}
                        {canEdit && !editMode && (
                            <Button height="30px" fontSize="12pt" pr={6} pl={6} onClick={enableEditMode}>
                                Edit your Profile
                            </Button>
                        )}
                    </Flex>
                </Card>
            {/*</Center>*/}
        </>

    );
};

export default UserHeader;