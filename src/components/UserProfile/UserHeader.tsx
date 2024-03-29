import React, { useEffect, useState } from "react";
import firebase from "firebase/compat";
import {
    getAuth,
    onAuthStateChanged,
    User,
    updateProfile,
} from "firebase/auth";
import { Box, Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { FaQuestionCircle } from "react-icons/fa";
import { Center, Square, Circle } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";

const UserHeader: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [introduction, setIntroduction] = useState<string>("");
    const [backgroundImage, setBackgroundImage] = useState<string>("");
    const [editMode, setEditMode] = useState<boolean>(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleIntroductionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIntroduction(event.target.value);
    };

    const saveIntroduction = () => {
        if (user) {
            updateProfile(user, { displayName: user.displayName, photoURL: user.photoURL})
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

    return (
        <Center color="white" w="100%" position="absolute">
            <Card alignContent="center" justifyContent="center" maxW="sm" top="10" width="100%" >
                <Box
                    position="relative"
                    h={40}
                    bgImage="url('https://www.utep.edu/extendeduniversity/utepconnect/blog/june-2019/how-an-online-degree-can-prepare-you-for-remote-positions.jpg')"
                    bgSize="cover"
                    bgPosition="center"
                    bgRepeat="no-repeat"
                    left={0}
                    right={0}
                    width="100vw"
                    maxWidth="100%"
                >
                </Box>
                <Flex right="10">
                    {user?.photoURL ? (
                        <Image
                            fontSize={64}
                            position="relative"
                            top={-8}
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

                <Flex padding="10px 16px" alignContent="flex-start" justifyContent="space-between">
                    <Box>
                        <Text fontWeight={800} fontSize="16pt"  >
                            {user ? user.displayName : "Waiting for you to login"}
                        </Text>
                    </Box>

                </Flex>

                <Flex padding="10px 20px" alignContent="flex-start" justifyContent="left">
                    <Box w="sm">
                        <Input
                            placeholder="Here to start your introduction"
                            value={introduction}
                            onChange={handleIntroductionChange}
                            size="lg"
                            resize="vertical"
                            isReadOnly={!editMode}
                        />
                    </Box>
                </Flex>
                <Flex padding="10px 16px" alignContent="flex-start" justifyContent="left">
                    {editMode && (
                        <Button height="30px" fontSize="12pt" pr={6} pl={6} onClick={saveIntroduction}>
                            Save Introduction
                        </Button>

                    )}
                    {!editMode && (
                        <Button height="30px" fontSize="12pt" pr={6} pl={6} onClick={enableEditMode}>
                            Edit
                        </Button>
                    )}

                </Flex>

            </Card>
        </Center>
    );
};

export default UserHeader;