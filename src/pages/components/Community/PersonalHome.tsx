import React, { useState } from "react";
import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GiQuillInk } from "react-icons/gi";
import { useRecoilValue } from "recoil";
import { communityState } from "@/atoms/communitiesAtom";
import CreateCommunityModal from "@/pages/components/Modal/CreateCommunity/CreateCommunityModal"; // Import the modal

const PersonalHome: React.FC = () => {
  const router = useRouter();
  const communityStateValue = useRecoilValue(communityState);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

  const handleCreatePost = () => {
    if (communityStateValue.currentCommunity) {
      // Navigate to the submit page for the current community
      router.push(`/r/${communityStateValue.currentCommunity.id}/submit`);
    } else {
      alert("Please select a community to create a post.");
    }
  };

  const handleCreateCommunity = () => {
    // Open the CreateCommunityModal
    setIsModalOpen(true);
  };

  return (
    <>
      <Flex
        direction="column"
        bg="white"
        borderRadius={4}
        cursor="pointer"
        border="1px solid"
        borderColor="gray.300"
      >
        <Flex
          align="flex-end"
          color="white"
          p="6px 10px"
          bg="blue.500"
          height="34px"
          borderRadius="4px 4px 0px 0px"
          fontWeight={600}
          bgImage="url(/images/comicraft-Home.png)"
          backgroundSize="cover"
        ></Flex>
        <Flex direction="column" p="12px">
          <Flex align="center" mb={2}>
            <Icon as={GiQuillInk} fontSize={50} color="gold" mr={2} />
            <Text fontWeight={600}>Home</Text>
          </Flex>
          <Stack spacing={3}>
            <Text fontSize="9pt">
              Your personal Comicraft frontpage, built for you.
            </Text>
            <Button height="30px" onClick={handleCreatePost}>
              Create Post
            </Button>
            <Button variant="outline" height="30px" onClick={handleCreateCommunity}>
              Create Community
            </Button>
          </Stack>
        </Flex>
      </Flex>

      {/* Render the CreateCommunityModal */}
      <CreateCommunityModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PersonalHome;
