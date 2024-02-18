import React from "react";
import
{
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
}
from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const Searchbar: React.FC = () => (
    <Flex flexGrow={1} mr={2} align="center">
        <InputGroup ml={2}>
            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" mb={1}/>}/>
            <Input
                border="none"
                height="34px"
                placeholder="What's the right channel?"
                fontSize="10pt"
                _placeholder={{ color: "gray.300" }}
                _hover={{
                    bg: "#FFFFFF",
                    border: "1px solid",
                    borderColor: "#CDF6F9"
                }}
                _focus={{
                    outline: "none",
                    border: "1px solid",
                    borderColor: "#CDF6F9"
                }}
            />
        </InputGroup>
    </Flex>
);

export default Searchbar;
