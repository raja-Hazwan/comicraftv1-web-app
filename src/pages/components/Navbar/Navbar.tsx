import { Flex, Image, Box } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContext from './RightContent/RightContext';
import { auth } from '@/firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import Directory from './Directory/Directory';
import useDirectory from '@/hooks/useDirectory';
import { defaultMenuItem } from '@/atoms/directoryMenuAtom';

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();

  return (
    <Flex bg="white" height="80px" padding="8px 16px" align="center" justify={{ md: 'space-between' }}>
      <Flex
        align="center"
        gap={{ base: '8px', md: '1px' }}
        width={{ base: 'auto', md: 'auto' }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        {/* Book Logo with Hover Animation */}
        <Box
          transition="transform 0.3s ease"
          _hover={{ transform: 'scale(1.1)' }}
        >
          <Image
            src="/images//book logo.png"
            height={{ base: '60px', md: '80px', lg: '100px' }}
            alt="Book Logo"
          />
        </Box>
        {/* Real Logo with Hover Animation */}
        <Box
          transition="transform 0.3s ease"
          _hover={{ transform: 'scale(1.1) rotate(5deg)' }}
          marginLeft="-12px"
        >
          <Image
            src="/images//real logo.png"
            height={{ base: '0px', md: '120px', lg: '140px' }}
            display={{ base: 'none', md: 'block' }}
            alt="Real Logo"
          />
        </Box>
      </Flex>
      {user && <Directory />}
      {/* Passing user prop to enable search functionality */}
      <SearchInput user={user} />
      <RightContext user={user} />
    </Flex>
  );
};

export default Navbar;