import { Button, Flex, Image } from '@chakra-ui/react';
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
        <Flex justify={"center"} align={"center"} width={"100%"}>
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
                    onClick={() => {
                        selectedFileRef.current?.click();
                    }}>
                    Upload
                </Button>
                <input
                    ref={selectedFileRef}
                    type={"file"}
                    hidden
                    onChange={onSelectedImage}
                />
                <Image src={selectedFile} alt={"selected file"} />

            </Flex>
        </Flex>
    );
}

export default ImageUpload;