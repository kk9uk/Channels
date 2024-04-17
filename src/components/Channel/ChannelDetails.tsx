import React, { useRef, useState } from "react"; 
import { Channel, channelState } from "../../state/channelState";
import { Box, Button, Divider, Flex, Icon, Image, Spinner, Stack, Text } from "@chakra-ui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "../../firebase/clientApp";
import useSelectFile from "../../hooks/useSelectFile";
import { FaQuestionCircle } from "react-icons/fa";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useSetRecoilState } from "recoil";

type ChannelDetailsProps = {
    channel: Channel,
};

const ChannelDetails: React.FC<ChannelDetailsProps> = ({ channel }) => {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const {selectedFile, setSelectedFile, onSelectFile} = useSelectFile();
    const [uploadingImg, setUploadingImg] = useState(false);
    const setChannelStateVal = useSetRecoilState(channelState);

    const onUpdateImg = async () => {
        if (!selectedFile) return;
        setUploadingImg(true);
        try {
            const imgRef = ref(storage, `channels/${channel.channelName}/image`);
            await uploadString(imgRef, selectedFile, 'data_url');
            const downloadURL = await getDownloadURL(imgRef);
            await updateDoc(doc(firestore, 'channels', channel.channelName), {
                iconUrl: downloadURL,
            });

            setChannelStateVal((prev) => ({
                ...prev,
                currentChannel: {
                    ...prev.currentChannel,
                    iconUrl: downloadURL,
                } as Channel,
            }));
        } catch (error) {
            console.log('Admin update channel icon error', error);
        }
        setUploadingImg(false);
    };

    return (
        <Box position='sticky' top='14px'>
            {/* Channel Status */}
            <Flex  
                justify='space-between' 
                align='center'
                bg='blue.500'
                color='white'
                p={3}
                borderRadius='4px 4px 0px 0px'
            >
                <Text fontSize='10pt' fontWeight={700}>Channel Status</Text>
                <Icon as={HiOutlineDotsHorizontal}/>
            </Flex>

            {/* Channel Details */}
            <Flex 
                direction='column'
                p={3}
                bg='white'
                borderRadius='0px 0px 4px 4px'
            >
                <Stack>
                    <Flex width='100%' p={2} fontSize='10pt'>
                        {/* Members in the Channel */}
                        <Flex direction='column' flexGrow={1} fontWeight={700}>
                            <Text>{channel.noOfMember.toLocaleString()}</Text>
                            <Text>Members</Text>
                        </Flex>

                        {/* Online members no. */}
                        <Flex direction='column' flexGrow={1}>
                            <Text>1</Text>
                            <Text>Online</Text>
                        </Flex>

                    </Flex>

                    <Divider/>

                    {/* Created Time */}
                    <Flex 
                        align='center' 
                        width='100%'
                        p={1}
                        fontWeight={500}
                        fontSize='10pt'
                    >
                        <Icon as={RiCakeLine} fontSize={18} mr={2}/>
                        {channel.createdAt && (
                            <Text>
                                Created At{" "}
                                {moment(new Date(channel.createdAt?.seconds * 1000)).format("MMM DD, YYYY")}
                            </Text>
                        )}
                    </Flex>
                    
                    {/* Alternative button to create post, nav to create page */}
                    <Link href={`/${router.query.channelName}/submit`}>
                        <Button mt={3} height='30px'>
                            Create Post
                        </Button>
                    </Link>
                    
                    {/* Admin manage channel */}
                    {user?.uid === channel.creatorId && (
                        <>
                            <Divider/>
                            <Stack spacing={1} fontSize='10pt'>
                                <Text fontWeight={600}>
                                    Admin Management
                                </Text>

                                <Flex align='center' justify='space-between'>
                                    <Text 
                                        color='blue.500'
                                        cursor='pointer'
                                        _hover={{textDeocration: 'underline'}}
                                        onClick={() => selectedFileRef.current?.click()}
                                    >
                                        Change Channel Icon
                                    </Text>
                                    {channel.iconUrl || selectedFile ? (
                                        <Image 
                                            src={selectedFile || channel.iconUrl} 
                                            borderRadius='full'
                                            boxSize='40px'
                                            alt='Channel Image'
                                        />
                                    ) : (
                                        <Icon
                                            as={FaQuestionCircle}
                                            fontSize={40}
                                            color='brand.100'
                                            mr={2}
                                        />
                                    )}
                                </Flex>

                                {selectedFile && 
                                    (uploadingImg ? (
                                        <Spinner/>
                                    ) : (
                                        <Text cursor='pointer' onClick={onUpdateImg}>
                                            Save Changes
                                        </Text>
                                    ))
                                }
                                <input
                                    id='file-upload'
                                    type='file'
                                    accept='image/x-png,image/gif,image/jpeg,video/*'
                                    hidden
                                    ref={selectedFileRef}
                                    onChange={onSelectFile}
                                />
                            </Stack>
                        </>
                    )}

                </Stack>
            </Flex>
        </Box>
    );
};

export default ChannelDetails;