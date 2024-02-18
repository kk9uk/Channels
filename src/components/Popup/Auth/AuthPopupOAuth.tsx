import React from "react";
import { Flex, Button, Image } from "@chakra-ui/react";

const AuthPopupOAuth: React.FC = () => {
    return (
        <Flex direction="column" width="100%" mb={4}>
            <Button variant="oauth">
                <Image src="/images/google.png" height="20px" mr={4}/>
                Continue with Google
            </Button>
        </Flex>
    );
};

export default AuthPopupOAuth;
