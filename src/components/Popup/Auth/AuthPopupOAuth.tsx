import React from "react";
import { Flex, Button, Image, Text } from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";

const AuthPopupOAuth: React.FC = () => {
    const [
        signInWithGoogle,
        user,
        isLoading,
        serverError
    ] = useSignInWithGoogle(auth);
    return (
        <Flex direction="column" width="100%" mb={4}>
            <Button variant="oauth" isLoading={isLoading} onClick={() => signInWithGoogle()}>
                <Image src="/images/google.png" height="20px" mr={4}/>
                Continue with Google
            </Button>
            {serverError && <Text>{serverError.message}</Text>}
        </Flex>
    );
};

export default AuthPopupOAuth;
