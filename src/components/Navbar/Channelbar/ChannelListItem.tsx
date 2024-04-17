import React, {Component} from 'react';
import PropTypes, {string} from 'prop-types';
import {IconType} from "react-icons";
import {Flex, Icon, MenuItem, Image} from "@chakra-ui/react";
import useChannelBar from "../../../hooks/useChannelBar";



type ChannelListItemProp = {
    displayText: string;
    link: string;
    icon: IconType;
    iconColor: string;
    imageURL?: string;

};
const ChannelListItem:React.FC<ChannelListItemProp> = ({
                                                           displayText,
                                                           link,
                                                           icon,
                                                           iconColor,
                                                           imageURL,
                                                       }) =>{
    {
        const { onSelectMenuItem } = useChannelBar();

        return (
            <MenuItem
                width="100%"
                fontSize="10pt"
                _hover={{ bg: "gray.100" }}
                onClick={() =>
                    onSelectMenuItem({ displayText, link, icon, iconColor, imageURL })
                }
            >
                <Flex alignItems="center">
                    {imageURL ? (
                        <Image borderRadius="full" boxSize="18px" src={imageURL} mr={2} />
                    ) : (
                        <Icon fontSize={20} mr={2} as={icon} color={iconColor} />
                    )}
                    {displayText}
                </Flex>
            </MenuItem>
        );
    }
}



export default ChannelListItem;