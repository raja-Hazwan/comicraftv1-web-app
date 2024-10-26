import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContext from './RightContent/RightContext';



const Navbar:React.FC = () => {
    
    return (
        <Flex bg="white" height="44px" padding="6px 12px">
            <Flex align="center">
            <Image src = "/images//comicraft-logo2.svg" height='100px' display = {{  base : "none", md:"unset"}}/>
            <Image src = "/images//comicraft-logo.svg" height='200px' />
            </Flex>
            <SearchInput />
           {/* <Directory />*/}
            <RightContext />
        </Flex>
        
    );
};
export default Navbar;