import React from 'react';
import ContentLayout from '../../components/Layout/ContentLayout';
import { Box, Text} from '@chakra-ui/react';
import NewPostForm from '../../components/Posts/NewPostForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';

const SubmitPostPage: React.FC = () => {
    const [user] = useAuthState(auth);

    return (
        <ContentLayout>
            <>
                <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
                    <Text>Create a post</Text>
                </Box>
                {user && <NewPostForm user = {user} />}
            </>
            <>{/* {About} */}</>
        </ContentLayout>
    );
};

export default SubmitPostPage;
