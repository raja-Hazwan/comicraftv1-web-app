import { auth } from '@/firebase/clientApp';
import PageContent from '@/pages/components/Layout/PageContent';
import NewPostForm from '@/pages/components/Posts/NewPostForm';
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const SubmitPostPage:React.FC = () => {
  const [user] = useAuthState(auth);
  return (
    <PageContent>
      <>
        <Box p = "14px 0px" borderBottom = "1px solid" borderColor = "white">
          <Text>Create a Posts</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
     <> {/* About */} </>
    </PageContent>
  )
}
export default SubmitPostPage