import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import Link from "next/link";

const UserNotFound: React.FC = () => {
    return (
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
        >
            Sorry, that user does not exist or has been banned
            <Link href="/">
                <Button mt={4}>GO HOME</Button>
            </Link>
        </Flex>
    );
};

export default UserNotFound;
