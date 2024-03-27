import { Flex, Icon } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';

type NewPostFormProps = {};

const formTabs: TabItem[] = [
    {
        title: "Post",
        icon: IoDocumentText,
    },
    {
        title: "Image & Video",
        icon: IoImageOutline,
    },
    {
        title: "Link",
        icon: BsLink45Deg,
    },
    {
        title: "Poll",
        icon: BiPoll,
    },
    {
        title: "Talk",
        icon: BsMic,
    },
];

export type TabItem = {
    title: string;
    icon: typeof Icon.arguments;
}

const NewPostForm: React.FC<NewPostFormProps> = () => {
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
    const [textInput, setTextInput] = useState({
        title: "",
        body: "",
    });
    const [selectedFile, setSelecedFile] = useState<string>();
    const [loading, setLoading] = useState(false);

    const handleCreatePost = async() => {

    };

    const onSelectedImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
            setSelecedFile(readerEvent.target.result as string);
            };
        };
    }

    const onTextChange = ({
        target: { name, value },
      }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTextInput((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    

    return (
        <Flex direction="column" bg="white" borderRadius="4" mt="2">
            <Flex width="width">
                {formTabs.map((item) => (
                    <TabItem key={item.title} item={item}
                        selected={item.title === selectedTab} setSelectedTab={setSelectedTab}/>
                ))}
            </Flex>
            <Flex p={4}>
                {
                    selectedTab === "Post" && (
                        <TextInputs 
                            textInputs={textInput}
                            handleCreatePost={handleCreatePost}
                            onChange={onTextChange}
                            loading={loading}
                        />
                    )
                }
                {
                    selectedTab === "Image & Video" && (
                        <ImageUpload
                            selectedFile={selectedFile}
                            onSelectedImage={onSelectedImage}
                            setSelectedTab={setSelectedTab}
                            setSelectedFile={setSelecedFile}
                        />
                    )
                }
            </Flex>
        </Flex>      
    );
};

export default NewPostForm;