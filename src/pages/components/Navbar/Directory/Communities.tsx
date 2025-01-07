import React, { useState } from 'react';
import CreateCommunityModal from '../../Modal/CreateCommunity/CreateCommunityModal';
import { Box, Flex, Icon, MenuItem, Text, Spinner } from '@chakra-ui/react';
import { GrAdd } from 'react-icons/gr';
import { communityState } from '@/atoms/communitiesAtom';
import { useRecoilValue } from 'recoil';
import MenuListItem from './MenuListItem';
import { GiBookAura } from 'react-icons/gi';
import { AiFillHome } from 'react-icons/ai';
import { FaFire } from 'react-icons/fa'; // Changed to FaFire
import { IoInformationCircle } from 'react-icons/io5';

const Communities: React.FC = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState)?.mySnippets || [];

  if (!mySnippets) {
    return <Spinner />;
  }

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      {/* Navigation Links */}
      <Box mt={3} mb={4}>
        <MenuListItem
          key="home"
          icon={AiFillHome}
          displayText="Home"
          link="/"
          iconColor="black"
        />
        <MenuListItem
          key="trending"
          icon={FaFire} // Changed from HiTrendingUp to FaFire
          displayText="Trending"
          link="/trending"
          iconColor="black"
        />
        <MenuListItem
          key="about"
          icon={IoInformationCircle}
          displayText="About"
          link="/about"
          iconColor="black"
        />
      </Box>
      {/* Moderating Communities */}
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              icon={GiBookAura}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              iconColor="brand.100"
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
      {/* My Communities */}
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          My Communities
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: 'gray.100' }}
          onClick={() => setOpen(true)}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={GiBookAura}
            displayText={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            iconColor="blue.500"
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
};

export default Communities;