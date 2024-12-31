import React from 'react';
import { Flex } from "@chakra-ui/react";

const Icons: React.FC = () => {
  return (
    <Flex>
      <Flex
        display={{ base: "none", md: "flex" }}
        align="center"
        borderRight="1px solid"
        borderColor="gray.200"
      >
        {/* Icons can be added here if needed */}
      </Flex>
    </Flex>
  );
};

export default Icons;
