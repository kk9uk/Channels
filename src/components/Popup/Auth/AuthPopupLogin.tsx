import { FunctionComponent, useState, ChangeEvent, FormEvent } from "react";
import { Input, Button, Flex, Text } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { authPopupState } from "../../../state/authPopupState";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import { FIREBASE_ERROR } from "../../../firebase/error";

const AuthPopupLogin: FunctionComponent = () => {
    const setAuthPopupState = useSetRecoilState(authPopupState);
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [
        signInWithEmailAndPassword,
        user,
        isLoading,
        serverError
    ] = useSignInWithEmailAndPassword(auth);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signInWithEmailAndPassword(credentials.email, credentials.password);
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCredentials((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name="email"
                placeholder="Email*"
                type="email"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            <Input
                required
                name="password"
                placeholder="Password*"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            <Text textAlign="center" color="red" fontSize="10pt">
                {FIREBASE_ERROR[serverError?.message as keyof typeof FIREBASE_ERROR]}
            </Text>
            <Button
                width="100%"
                height="36px"
                mt={2}
                mb={2}
                type="submit"
                isLoading={isLoading}
            >
                Login
            </Button>
            <Flex justifyContent="center" mb={2}>
                <Text fontSize="9pt" mr={1}>
                    Forgot your password?
                </Text>
                <Text
                    fontSize="9pt"
                    color="blue.500"
                    cursor="pointer"
                    onClick={() => setAuthPopupState(prev => ({
                        ...prev,
                        view: "Reset Password"
                    }))}
                >
                    Reset
                </Text>
            </Flex>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>New here?</Text>
                <Text
                    color="blue.500"
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() => setAuthPopupState(prev => ({
                        ...prev,
                        view: "Sign Up"
                    }))}
                >
                    SIGN UP
                </Text>
            </Flex>
        </form>
    );
};

export default AuthPopupLogin;
