import { DirectoryMenuItem, directoryMenuState } from '@/atoms/directoryMenuAtom';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { communityState } from '../atoms/communitiesAtom';
import { FaReddit, FaHome } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';

const useDirectory = () => {
  const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState);
  const router = useRouter();
  const communityStateValue = useRecoilValue(communityState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));
    router.push(menuItem.link);

    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  };

  useEffect(() => {
    const { currentCommunity } = communityStateValue;

    // Check if the user is on the home page
    if (router.pathname === '/') {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: 'Home',
          link: '/',
          icon: AiFillHome,
          iconColor: 'black',
        },
      }));
    } else if (currentCommunity) {
      // Set the selected menu item to the current community
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${currentCommunity.id}`,
          link: `r/${currentCommunity.id}`,
          imageURL: currentCommunity.imageURL,
          icon: FaReddit,
          iconColor: 'blue.500',
        },
      }));
    }
  }, [communityStateValue.currentCommunity, router.pathname]);

  return { directoryState, toggleMenuOpen, onSelectMenuItem };
};

export default useDirectory;
