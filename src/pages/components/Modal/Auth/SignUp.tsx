import React, { useEffect, useState } from 'react'; // React and useState hook
import { 
  Button, 
  Flex, 
  Input, 
  Text 
} from '@chakra-ui/react'; // Chakra UI components
import { useSetRecoilState } from 'recoil'; // Recoil state hook
import { authModalState } from '@/atoms/authModalAtom'; // Auth modal atom
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../../firebase/errors";
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods
import { firestore } from '../../../../firebase/clientApp'; // Firestore instance

const SignUp: React.FC = () => { 
    const setAuthModalState = useSetRecoilState(authModalState);
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState('');
    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
    ] = useCreateUserWithEmailAndPassword(auth);

    // Firebase logic
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (error) setError("");
        if (signUpForm.password !== signUpForm.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Passwords match
        createUserWithEmailAndPassword(signUpForm.email, signUpForm.password); 
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Update form state
        setSignUpForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };    
    
    const createUserDocument = async (user: User) => {
        await setDoc(
            doc(firestore, "users", user.uid),
            JSON.parse(JSON.stringify(user))
        );
    };

    useEffect(() => {
        if (userCred) {
            createUserDocument(userCred.user);
        }
    }, [userCred]);

    return (
        <form onSubmit={onSubmit}>
            <Input 
                required
                name='email' 
                placeholder='email' 
                type='email' 
                mb={2} 
                onChange={onChange} 
                fontSize='10pt'
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                bg="gray.50"
            />
            <Input
                required
                name='password' 
                placeholder='password' 
                type='password' 
                fontSize='10pt'
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                bg="gray.50"
                mb={2}
                onChange={onChange}  
            />
            <Input
                required
                name='confirmPassword' 
                placeholder='confirm password' 
                type='password' 
                fontSize='10pt'
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                bg="gray.50"
                mb={2}
                onChange={onChange}  
            />
            
            {(error || userError) && (
                <Text textAlign="center" color="red" fontSize="10pt">
                    {error || (userError && FIREBASE_ERRORS[userError.message as keyof typeof FIREBASE_ERRORS]) || "An unexpected error occurred."}
                </Text>
            )}

            <Button width="100%" height="36px" mt={2} mb={2} type='submit' isLoading={loading}>
                Sign Up
            </Button>
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr={1}>Already a ComiCrafter?</Text>
                <Text 
                    color="blue.500" 
                    fontWeight={700} 
                    cursor="pointer" 
                    onClick={() => setAuthModalState(prev => ({
                        ...prev,
                        view: "login"
                    }))}>
                    LOG IN
                </Text>
            </Flex>
        </form>
    );
};

export default SignUp;
