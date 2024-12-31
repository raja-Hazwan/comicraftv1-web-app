import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Recommendations from "@/pages/components/Community/Recommendations";
import Premium from "@/pages/components/Community/Premium";
import PersonalHome from "@/pages/components/Community/PersonalHome";


const Wrapper: React.FC = () => {
  return (
    <Box
      position="sticky"
      top="16px" // Adjust to your header's height or page padding
      zIndex={10} // Ensure it appears above other content
    >
      <Flex direction="column" gap="16px">
        <PersonalHome />
        <Premium />
        <Recommendations />
      </Flex>
    </Box>
  );
};

export default Wrapper;
