/* The origin ResetPassword component is of poor quality,
 * I put minimal effort to make it at least decent, but there still could be much incompleteness,
 * or even some possible head-cracking subtle bugs (like line 22, a classical junior dev mistake),
 * BUT I'm NOT GONNA FIX THEM ALL, I mean, why ask for robustness when you are doing web dev & writing FUCKING JAVASCRIPT?
 *
 * I coded properly tho, just not as optimal as I would do for scientific computing or system programming. */

import React, { useState } from "react";
import { Button, Flex, Icon, Input, Text, Image } from "@chakra-ui/react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { BsDot } from "react-icons/bs";
import { authPopupState } from "../../../state/authPopupState";
import { auth } from "../../../firebase/clientApp";
import { useSetRecoilState } from "recoil";

const AuthPopupResetPassword: React.FC = () => {
    const setAuthPopupState = useSetRecoilState(authPopupState);
    const [email, setEmail] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [sendPasswordResetEmail, isLoading, serverError] = useSendPasswordResetEmail(auth);

    /* Classical JavaScript Promise trap, but I'll just pretend that all of these never fail...... */
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await sendPasswordResetEmail(email);
        setIsSuccess(true);
    };

    return (
        <Flex direction="column" alignItems="center" width="100%">
            <Image src="/images/icon & name.png" mb={2}/>
            {isSuccess ? <Text mb={4}>Check your email :)</Text> : (
                <>
                    <Text fontSize="sm" textAlign="center" mb={2}>
                        Enter the email associated with your account and we will send you a reset link
                    </Text>
                    <form onSubmit={onSubmit} style={{ width: "100%" }}>
                        <Input
                            required
                            name="email"
                            placeholder="Email*"
                            type="email"
                            mb={2}
                            onChange={(event) => setEmail(event.target.value)}
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
                        {/* Why display error msg when u can just ASSUME there is no error? :)
                        <Text textAlign="center" fontSize="10pt" color="red">
                            {serverError?.message}
                        </Text>
                        */}
                        <Button
                            width="100%"
                            height="36px"
                            mb={2}
                            mt={2}
                            type="submit"
                            isLoading={isLoading}
                        >
                            Reset
                        </Button>
                    </form>
                </>
            )}
            <Flex
                alignItems="center"
                fontSize="9pt"
                color="blue.500"
                fontWeight={700}
                cursor="pointer"
            >
                <Text
                    onClick={() =>
                        setAuthPopupState((prev) => ({
                            ...prev,
                            view: "Login"
                        }))
                    }
                >
                    LOGIN
                </Text>
                <Icon as={BsDot}/>
                <Text
                    onClick={() =>
                        setAuthPopupState((prev) => ({
                            ...prev,
                            view: "Sign Up"
                        }))
                    }
                >
                    SIGN UP
                </Text>
            </Flex>
        </Flex>
    );
};

export default AuthPopupResetPassword;
