import React from 'react';
import ContentLayout from '../../components/Layout/ContentLayout';
import { Box, Text} from '@chakra-ui/react';
import NewPostForm from '../../components/Posts/NewPostForm';

const SubmitPostPage: React.FC = () => {

    return (
        <ContentLayout>
            <>
                <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
                    <Text>Create a post</Text>
                </Box>
                <NewPostForm/>
            </>
            <>{/* {About} */}</>
        </ContentLayout>
    );
};

export default SubmitPostPage;
