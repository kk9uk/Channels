import { FunctionComponent, useEffect } from "react";
import { Flex, Button, Image, Text } from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthPopupOAuth: FunctionComponent = () => {
    const [
        signInWithGoogle,
        user,
        isLoading,
        serverError
    ] = useSignInWithGoogle(auth);

    const createUserDocument = async (user: User) => {
        const userDocRef = doc(firestore, "users", user.uid);
        await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
    };

    useEffect(() => {
        if (user) {
            createUserDocument(user.user);
        }
    }, [user]);

    return (
        <Flex direction="column" width="100%" mb={4}>
            {/* Display button for signing in with Google */}
            <Button variant="oauth" isLoading={isLoading} onClick={() => signInWithGoogle()}>
                <Image src="/images/google.png" height="20px" mr={4}/>
                Continue with Google
            </Button>
            {/* Display server error message */}
            {serverError && <Text>{serverError.message}</Text>}
        </Flex>
    );
};

export default AuthPopupOAuth;