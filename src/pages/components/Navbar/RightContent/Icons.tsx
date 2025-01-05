import React from "react";
import { Flex, Icon } from "@chakra-ui/react";
import { FiInfo } from "react-icons/fi"; // About icon
import { useRouter } from "next/router"; // Next.js routing

const Icons: React.FC = () => {
  const router = useRouter(); // Initialize the router

  return (
    <Flex>
      {/* Parent Flex for Icons */}
      <Flex
        display={{ base: "none", md: "flex" }} // Hide on small screens
        align="center"
        borderRight="1px solid"
        borderColor="gray.200"
        pr={4} // Padding for spacing
      >
       
        {/* About Icon */}
        <Flex
          as="button"
          align="center"
          justify="center"
          aria-label="About"
          _hover={{
            transform: "scale(1.2)", // Slight zoom on hover
            color: "blue.500", // Change to blue on hover
          }}
          transition="all 0.3s ease" // Smooth animation
          onClick={() => router.push("/about")} // Redirect to the About page
        >
          <Icon as={FiInfo} boxSize={6} color="orange.400" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Icons;
