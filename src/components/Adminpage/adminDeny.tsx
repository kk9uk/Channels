import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import Link from "next/link";

const AdminDeny: React.FC = () => {
    return (
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
        >
            You are not admin
            <Link href="/">
                <Button mt={4}>GO HOME</Button>
            </Link>
        </Flex>
    );
};

export default AdminDeny;
