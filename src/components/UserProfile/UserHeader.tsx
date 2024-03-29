import React, { useEffect, useState } from "react";
import firebase from "firebase/compat";
import {
    getAuth,
    onAuthStateChanged,
    User,
    updateProfile,
} from "firebase/auth";
import {Box, Button, Flex, Icon, Input, Text, Textarea} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { FaQuestionCircle } from "react-icons/fa";
import { Center, Square, Circle } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";


type TextInputsProps = {
    textInputs: {
        title: string;
        body: string;
    };
    onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    loading: boolean;
};


const UserHeader: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [introduction, setIntroduction] = useState<string>("");
    const [backgroundImage, setBackgroundImage] = useState<string>(
        "https://www.utep.edu/extendeduniversity/utepconnect/blog/june-2019/how-an-online-degree-can-prepare-you-for-remote-positions.jpg"
    );
    const [editMode, setEditMode] = useState<boolean>(false);
    const [textInput, setTextInput] = useState({
        title: "",
        body: "",
    })

    // const onTextChange = ({
    //                           target: { name, value },
    //                       }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     setTextInput((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleIntroductionChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setIntroduction(event.target.value);
    };

    const saveIntroduction = () => {
        unableEditMode();
        console.log("bottom successfully!");
        if (user) {
            updateProfile(user, { displayName: user.displayName, photoURL: user.photoURL })
                .then(() => {
                    console.log("Introduction saved successfully!");
                })
                .catch((error) => {
                    console.log("Error saving introduction:", error);
                });
        }
    };

    const enableEditMode = () => {
        setEditMode(true);
    };

    const unableEditMode = () => {
        setEditMode(
            false)
    }

    return (
        //
        <>

            <Center color="white" w="100%" position="absolute">
                <Card alignContent="center" justifyContent="center" maxW="sm" top="10" width="100%" maxWidth="90%">
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
                                <Flex>
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
                                <Button marginRight="4" height="30px" fontSize="12pt" pr={6} pl={6}>
                                    Edit your image
                                </Button>
                                <Button marginRight="4" height="30px" fontSize="12pt" pr={6} pl={6} onClick={saveIntroduction}>
                                    Save
                                </Button>
                            </>
                        )}
                        {!editMode && (
                            <Button height="30px" fontSize="12pt" pr={6} pl={6} onClick={enableEditMode}>
                                Edit your Profile
                            </Button>
                        )}
                    </Flex>
                </Card>
            </Center>
        </>

    );
};

export default UserHeader;