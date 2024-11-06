import { Button, Flex, Image, Text } from '@chakra-ui/react'; // Added Image import
import React, { useEffect } from 'react'; // Import useEffect
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../../firebase/clientApp';
import { setDoc, doc } from 'firebase/firestore'; // Import setDoc and doc
import { User } from 'firebase/auth'; // Import User




const OAuthButton:React.FC = () => {
    const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth);
    
    const createUserDocument = async (user: User) => {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userData = JSON.parse(JSON.stringify(user)); // Wrap with JSON.parse(JSON.stringify(...))
        await setDoc(userDocRef, userData);
    };

    useEffect(() => {
        if (userCred) {
            createUserDocument(userCred.user);
        }
    }, [userCred]);

    return (
        <Flex direction="column" width="100%" mb={4}>
            <Button variant="oauth" mb={2} isLoading={loading} onClick={() => signInWithGoogle()}>
                <Image src="/images/googlelogo.png" height="20px" mr={2}/>
            Continue with Google
            </Button>
           
           {error && <Text>{error.message}</Text>}
        </Flex>
    )
}
export default OAuthButton;