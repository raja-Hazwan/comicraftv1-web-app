import { authModalState } from '@/atoms/authModalAtom';
import {
  Text,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButton';
import ResetPassword from './ResetPassword';
import { auth } from '@/firebase/clientApp';
import { useAuthState as useFirebaseAuthState } from 'react-firebase-hooks/auth';

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user] = useFirebaseAuthState(auth);

  const handleClose = React.useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  }, [setModalState]);

  useEffect(() => {
    if (user) handleClose();
    console.log('User:', user);
  }, [user, handleClose]);

  return (
    <Modal isOpen={modalState.open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          {modalState.view === 'login' && 'Login'}
          {modalState.view === 'signup' && 'Sign Up'}
          {modalState.view === 'resetPassword' && 'Reset Password'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          pb={6}
        >
          <Flex direction="column" align="center" justify="center" width="70%">
            {modalState.view === 'login' || modalState.view === 'signup' ? (
              <>
                <OAuthButtons />
                <Text color="gray.500" fontWeight={700}>
                  OR
                </Text>
                <AuthInputs />
              </>
            ) : (
              <ResetPassword />
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
