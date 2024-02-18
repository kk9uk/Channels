import React from "react";
import { Button } from "@chakra-ui/react";

const Auth: React.FC = () => (
    <>
        <Button variant="solid"
            height="30px"
            display={{ sm: "none", md: "flex" }}
            width={{ sm: "0px", md: "85px" }}
            mr={2}
        >
            Sign Up
        </Button>
        <Button variant="outline"
            height="30px"
            display={{ sm: "none", md: "flex" }}
            width={{ sm: "0px", md: "85px" }}
            mr={2}
        >
            Login
        </Button>
    </>
);

export default Auth;
