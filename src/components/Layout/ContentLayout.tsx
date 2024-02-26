import React from "react";
import { Flex } from "@chakra-ui/react";

const ContentLayout: React.FC = ({ children }) => {
    return (
        <Flex justify="center" p="16px 0px">
            <Flex
                width="95%"
                justify="center"
            >
                {/* LHS */}
                <Flex
                    direction="column"
                    width={{ sm: "100%", md: "65%" }}
                    mr={{ sm: 0, md: 6 }}
                >
                    {children && children[0 as keyof typeof children]}
                </Flex>

                {/* RHS */}
                <Flex
                    direction="column"
                    display={{ sm: "none", md: "flex" }}
                    flexGrow={1}
                >
                    {children && children[1 as keyof typeof children]}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ContentLayout;
