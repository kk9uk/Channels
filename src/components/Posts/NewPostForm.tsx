import { Alert, AlertIcon, AlertTitle, CloseButton, Flex, Icon } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Post } from '../../state/postState';
import { Timestamp, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import useSelectFile from '../../hooks/useSelectFile';

type NewPostFormProps = {
    user: User
    channelName: string
    channelIconUrl?: string
};

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

const NewPostForm: React.FC<NewPostFormProps> = ({ user, channelName, chann }) => {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
    const [textInput, setTextInput] = useState({
        title: "",
        body: "",
    });

    const {selectedFile, setSelectedFile, onSelectFile} = useSelectFile();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleCreatePost = async() => {
        const { channelName } = router.query;
        // console.log(channelName);

        // error of Post.id undefined, DO NOT touch this
        const newPost: Post = {
            channelName: channelName as string,
            creatorId: user?.uid,
            creatorName: user.displayName as string,
            title: textInput.title,
            body: textInput.body,
            numComments: 0,
            numPushPull: 0,
            createdAt: serverTimestamp() as Timestamp,
        };

        try {
            const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

            if (selectedFile) {
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedFile, "data_url");
                const downloadURL = await getDownloadURL(imageRef);

                await updateDoc(postDocRef, {
                    imageURL: downloadURL,
                });
            }

            router.back();
        } catch (error: any) {
            console.log("CreatePost error", error.message);
            setError(true);
        }
        setLoading(false);
    };

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
                            onSelectedImage={onSelectFile}
                            setSelectedTab={setSelectedTab}
                            setSelectedFile={setSelectedFile}
                        />
                    )
                }
            </Flex>
            {error && (
                <Alert status = "error">
                    <AlertIcon/>
                    <AlertTitle mr = {2}>
                        Create post error!
                    </AlertTitle>
                    <CloseButton position = "absolute" right = "8px" top = "8px"/>
                </Alert>
            )}
        </Flex>      
    );
};

export default NewPostForm;