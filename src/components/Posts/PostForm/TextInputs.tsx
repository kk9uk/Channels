import React from 'react'
import { Button, Flex, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { postState } from '../../../state/postState';
import moment from 'moment';

type TextInputsProps = {
    textInputs: {
        title: string;
        body: string;
        tweetBody: string;
    };
    onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    handleCreatePost: () => void;
    loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({textInputs, onChange, handleCreatePost, loading}) => {
    const [postStateVal, setPostStateVal] = useRecoilState(postState);
    if (postStateVal.isTweet && postStateVal.selectedPost) {
        textInputs.title = `Retweet: ${postStateVal.selectedPost?.title}    ` +
                        `By ${postStateVal.selectedPost?.creatorName}   ` +
                        `At ${moment(new Date(postStateVal.selectedPost.createdAt?.seconds * 1000)).format("MMM DD, YYYY")}`;
        textInputs.tweetBody = `Re: ${postStateVal.selectedPost?.body}`;
    }
    // console.log(textInputs);

    return (
        <Stack spacing={3} width="100%">
            <Input
            name="title"
            value={textInputs.title}
            onChange={onChange}
            fontSize={"10pt"}
            placeholder={"Title"}
            _placeholder={{ color: "gray.500" }}
            _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
            }}
             />
            {postStateVal.isTweet ? 
                <Text fontSize="12pt">
                    {textInputs.tweetBody}
                </Text>
            : <></>}
            <Textarea 
                name="body"
                value={textInputs.body}
                onChange={onChange}
                fontSize={"10pt"}
                placeholder={"Text (optional)"}
                _placeholder={{ color: "gray.500" }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "black",
                }}
                height="100px"
            
            />
            <Flex justify={'flex-end'}>
                <Button
                    height={"34px"}
                    padding={"0px 30px"}
                    disabled={!textInputs.title}
                    isLoading={loading}
                    onClick={handleCreatePost}
                >
                    Post
                </Button>
            </Flex>
        </Stack>
    );
};

export default TextInputs;
