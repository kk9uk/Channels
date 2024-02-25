import { FunctionComponent, useState } from "react";
import CreateChannelPopup from "../../Popup/CreateChannel/CreateChannelPopup";
import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";

const DropdownMenu: FunctionComponent = () => {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <>
            <CreateChannelPopup isOpened={isOpened} onClose={() => setIsOpened(false)}/>
            <MenuItem
                width="100%"
                fontSize="10pt"
                _hover={{ bg: "gray.100" }}
                onClick={() => setIsOpened(true)}
            >
                <Flex align="center">
                    <Icon fontSize={20} mr={2} as={GrAdd}/>
                    Create Channel
                </Flex>
            </MenuItem>
        </>
    );
};

export default DropdownMenu;
