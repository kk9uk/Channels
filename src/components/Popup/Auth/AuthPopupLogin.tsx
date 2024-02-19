import { FunctionComponent, useState, ChangeEvent } from "react";
import { Input, Button, Flex, Text } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { authPopupState } from "../../../state/authPopupState";

const AuthPopupLogin: FunctionComponent = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const setAuthPopupState = useSetRecoilState(authPopupState);

    const onSubmit = () => {};

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
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                _focus={{
                    outline: "none",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
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
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                _focus={{
                    outline: "none",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
            />
            <Button width="100%" height="36px" mt={2} mb={2} type="submit">Login</Button>
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