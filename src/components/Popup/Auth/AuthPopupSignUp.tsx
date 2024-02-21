import { FunctionComponent, useState, ChangeEvent, FormEvent } from "react";
import { Input, Button, Flex, Text } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { authPopupState } from "../../../state/authPopupState";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import { FIREBASE_ERROR } from "../../../firebase/error";

const AuthPopupSignUp: FunctionComponent = () => {
    const setAuthPopupState = useSetRecoilState(authPopupState);
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [clientError, setClientError] = useState("");
    const [
        createUserWithEmailAndPassword,
        user,
        isLoading,
        serverError
    ] = useCreateUserWithEmailAndPassword(auth);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (clientError) setClientError("");
        if (credentials.password !== credentials.confirmPassword) {
            setClientError("Passwords do not match");
            return;
        }
        else if (credentials.password.length < 6) {
            setClientError("Password has to be at least 6 characters long");
            return;
        }
        createUserWithEmailAndPassword(credentials.email, credentials.password);
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
                    bg: "#FFFFFF",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "#FFFFFF",
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
                    bg: "#FFFFFF",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "#FFFFFF",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            <Input
                required
                name="confirmPassword"
                placeholder="Confirm Password*"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "#FFFFFF",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "#FFFFFF",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            <Text textAlign="center" color="red" fontSize="10pt">
                {clientError || FIREBASE_ERROR[serverError?.message as keyof typeof FIREBASE_ERROR]}
            </Text>
            <Button
                width="100%"
                height="36px"
                mt={2}
                mb={2}
                type="submit"
                isLoading={isLoading}
            >
                Sign Up
            </Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>Already have an account?</Text>
                <Text
                    color="blue.500"
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() => setAuthPopupState(prev => ({
                        ...prev,
                        view: "Login"
                    }))}
                >
                    LOGIN
                </Text>
            </Flex>
        </form>
    );
};

export default AuthPopupSignUp;
