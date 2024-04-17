import { Button, Flex, Image, Stack } from '@chakra-ui/react';
import React from 'react'
import { useRef } from 'react';

type ImageUploadProps = {
    selectedFile?: string;
    onSelectedImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedTab: (title: string) => void;
    setSelectedFile: (file: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
    selectedFile, onSelectedImage, setSelectedTab, setSelectedFile
}) => {

    const selectedFileRef = useRef<HTMLInputElement>(null);
    return (
        <Flex direction={"column"} justify={"center"} align={"center"} width={"100%"}>
            {selectedFile ? (
                <>
                    <Image src={selectedFile} maxWidth = "400px" maxHeight = "400px" />
                    <Stack direction = "row" mt = {4}>
                        <Button height = "28px" onClick = {() => setSelectedTab("Post")}>
                            Back to Post
                        </Button>
                        <Button 
                            variant = "outline"
                            height = "28px"
                            onClick = {() => setSelectedFile("")}
                        >
                            Remove image/video
                        </Button>
                    </Stack>
                </>
            ) : (
            <Flex
                justify={"center"}
                align={"center"}
                p={20}
                border={"1px dashed"}
                borderColor={"gray.200"}
                borderRadius={4}
                width={"100%"}
                >
                <Button
                    variant={"outline"}
                    height={"28px"}
                    onClick={() => 
                        selectedFileRef.current?.click()
                    }
                >
                    Upload
                </Button>
                <input
                    ref={selectedFileRef}
                    type= "file"
                    hidden
                    onChange={onSelectedImage}
                />
            </Flex> 
            )}
        </Flex>
    );
}

export default ImageUpload;