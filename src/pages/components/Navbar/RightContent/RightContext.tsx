import { Flex } from '@chakra-ui/react';
import React from 'react';
import AuthButtons from './AuthButtons';
import AuthModal from '../../Modal/Auth/AuthModal';

type RightContextProps = {
// user: any:    
};

const RightContext:React.FC<RightContextProps> = () => {
    
    return (
        <>
        <AuthModal/>
        <Flex justify='center' align='center'>
            <AuthButtons />
        </Flex>
        </>
    )
}
export default RightContext;