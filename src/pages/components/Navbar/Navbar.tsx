import React from 'react';
import { Flex } from '@chakra-ui/react';
import Image from 'next/image';

const Navbar:React.FC = () => {
    
    return (
        <Flex bg="white" height="50px" padding="6px 12px">
            <Flex align="center">
          <Image src="/images/logo.png" alt="Logo" width={175} height={30} />
                </Flex>
        </Flex>
    )

}
export default Navbar;