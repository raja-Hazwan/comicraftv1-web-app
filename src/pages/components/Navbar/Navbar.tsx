import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContext from './RightContent/RightContext';
import { auth } from '@/firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import Directory from './Directory/Directory';


const Navbar: React.FC = () => {
    const [user, loading, error] = useAuthState(auth);
    return (
        <Flex bg="white" height="80px" padding="8px 16px" align="center" justify={{ md: "space-between"}}>
            <Flex align="center" gap="1px" width={{ base: "40px", md: "auto"}} mr={{ base: 0, md: 2}}> {/* Minimal gap */}
                {/* Book logo: Always visible */}
                <Image 
                    src="/images//book logo.png" 
                    height={{ base: '60px', md: '80px', lg: '100px' }} 
                    alt="Book Logo" 
                />
                {/* Real logo: Larger and very close to the book logo */}
                <Image 
                    src="/images//real logo.png" 
                    height={{ base: '0px', md: '120px', lg: '140px' }} 
                    display={{ base: 'none', md: 'block' }} 
                    alt="Real Logo" 
                    marginLeft="-12px" /* More negative margin for tighter alignment */
                />
            </Flex>
            {user && <Directory />}
            <SearchInput user={user} />
            <RightContext user={user} />
        </Flex>
    );
};

export default Navbar;



