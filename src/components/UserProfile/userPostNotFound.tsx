import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import Link from "next/link";
import Recommendations from "../Channel/Recommndations";

const UserPostNotFound: React.FC = () => {
    return (
        <>
        <Flex
            direction="column"
            justifyContent="center"
            minHeight="60vh"
        >
            This person does not have any posts yet. Please follow those channels and post your own content.
            <Recommendations/>


        </Flex>
        <Flex
            direction="column"
            justifyContent="center"

            alignItems="center"
        >
            <Link href="/">
                <Button mt={4}>GO HOME</Button>
            </Link>

        </Flex>
        </>
    );
};

export default UserPostNotFound;
