import {Flex} from '@chakra-ui/react';
import React from 'react';
import AuthButtons from './AuthButtons';
import AuthModal from '../../Modal/Auth/AuthModal';
import { User } from 'firebase/auth';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContextProps = {
 user?: User | null;   
};

const RightContext:React.FC<RightContextProps> = ({ user }) => {
    
    return (
        <>
        <AuthModal/>
        <Flex justify='center' align='center'>
          {user ? <Icons />  : <AuthButtons />}
          <UserMenu user={user} />
        </Flex>
      </>
    )
}
export default RightContext;