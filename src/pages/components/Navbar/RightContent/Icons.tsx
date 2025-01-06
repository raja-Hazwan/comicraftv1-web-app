import React from "react";
import { Flex, Icon, Text, useBreakpointValue } from "@chakra-ui/react";
import { FiInfo } from "react-icons/fi"; // About icon
import { useRouter } from "next/router"; // Next.js routing
import { FaFire } from "react-icons/fa"; // Trending icon

const Icons: React.FC = () => {
  const router = useRouter(); // Initialize the router

  // Responsive breakpoint value to control visibility of icons
  const displayIcons = useBreakpointValue({ base: "none", md: "flex" });

  return (
    <Flex>
      {/* Parent Flex for Icons */}
      <Flex
        display={displayIcons} // Hide on small screens
        align="center"
        borderRight="1px solid"
        borderColor="gray.200"
        pr={4} // Padding for spacing
      >
        {/* Trending This Month Button */}
        <Flex
          as="button"
          align="center"
          justify="center"
          aria-label="Trending This Month"
          _hover={{
            bg: "gray.100", // Highlight background color on hover
            color: "orange.500", // Highlight icon and text color
          }}
          px={2} // Padding on the x-axis for spacing
          py={1} // Padding on the y-axis for spacing
          borderRadius="md" // Slightly rounded corners
          transition="background-color 0.2s ease" // Smooth transition
          onClick={() => router.push("/trending")} // Redirect to the Trending page
          mr={4} // Margin-right for spacing between icons
        >
          <Icon as={FaFire} boxSize={5} color="orange.400" /> {/* Adjusted boxSize */}
          <Text ml={2} fontSize="sm" fontWeight="bold" color="gray.600">
            Trending
          </Text>
        </Flex>

        {/* About Icon */}
        <Flex
          as="button"
          align="center"
          justify="center"
          aria-label="About"
          _hover={{
            bg: "gray.100", // Highlight background color on hover
            color: "blue.500", // Highlight icon and text color
          }}
          px={2} // Padding on the x-axis for spacing
          py={1} // Padding on the y-axis for spacing
          borderRadius="md" // Slightly rounded corners
          transition="background-color 0.2s ease" // Smooth transition
          onClick={() => router.push("/about")} // Redirect to the About page
        >
          <Icon as={FiInfo} boxSize={5} color="orange.400" /> {/* Keeping boxSize consistent */}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Icons;
