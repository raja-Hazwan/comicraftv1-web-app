import React from "react";
import { Flex, Icon } from "@chakra-ui/react";
import { FiInfo } from "react-icons/fi";
import { useRouter } from "next/router";
import { FaFire } from "react-icons/fa";

const Icons: React.FC = () => {
  const router = useRouter();
  return (
    <Flex>
      <Flex
        align="center"
        borderRight="1px solid"
        borderColor="gray.200"
        pr={4}
        bg="white"
      >
        <Flex
          as="button"
          align="center"
          justify="center"
          aria-label="Trending This Month"
          _hover={{
            bg: "gray.100",
            color: "orange.500",
          }}
          px={2}
          py={1}
          borderRadius="md"
          transition="background-color 0.2s ease"
          onClick={() => router.push("/trending")}
          mr={4}
        >
          <Icon as={FaFire} boxSize={6} color="orange.400" />
        </Flex>
        <Flex
          as="button"
          align="center"
          justify="center"
          aria-label="About"
          _hover={{
            bg: "gray.100",
            color: "blue.500",
          }}
          px={2}
          py={1}
          borderRadius="md"
          transition="background-color 0.2s ease"
          onClick={() => router.push("/about")}
        >
          <Icon as={FiInfo} boxSize={6} color="orange.400" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Icons;