import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContext from './RightContent/RightContext';

const Navbar: React.FC = () => {
    return (
        <Flex bg="white" height="80px" padding="8px 16px" align="center">
            <Flex align="center" gap="1px"> {/* Minimal gap */}
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
            <SearchInput />
            <RightContext />
        </Flex>
    );
};

export default Navbar;
