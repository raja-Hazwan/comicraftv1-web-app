import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Stack,
  Icon,
  Divider,
  Container,
  SimpleGrid,
  Avatar,
  HStack,
  Button,
} from "@chakra-ui/react";
import { FiInfo, FiUsers, FiGlobe, FiTrendingUp } from "react-icons/fi";
import Link from "next/link"; // Import the Link component from Next.js

const AboutPage: React.FC = () => {
  return (
    <Box py={10} px={4}>
      {/* Page Title */}
      <VStack spacing={6} textAlign="center" mb={10}>
        <Icon as={FiInfo} boxSize={12} color="blue.500" />
        <Heading as="h1" size="xl">
          About Us
        </Heading>
       
      </VStack>

      {/* Content */}
      <Container maxW="container.lg">
        <Box bg="white" p={8} rounded="lg" shadow="md">
          <Stack spacing={6}>
            {/* Mission Section */}
            <Box>
              <Heading as="h2" size="md" mb={2}>
                Our Mission
              </Heading>
              <Text fontSize="md" color="gray.700">
                Our mission is to connect people through shared interests and meaningful discussions. We want to empower individuals to express themselves and learn from others, building a better community for all.
              </Text>
            </Box>

            <Divider />

            {/* Core Values Section */}
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Our Core Values
              </Heading>
              <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                <VStack>
                  <Icon as={FiUsers} boxSize={8} color="blue.500" />
                  <Text fontWeight="bold">Community</Text>
                  <Text textAlign="center" fontSize="sm" color="gray.600">
                    We value inclusivity and building meaningful connections.
                  </Text>
                </VStack>
                <VStack>
                  <Icon as={FiGlobe} boxSize={8} color="green.500" />
                  <Text fontWeight="bold">Global Reach</Text>
                  <Text textAlign="center" fontSize="sm" color="gray.600">
                    Connecting people from all over the world.
                  </Text>
                </VStack>
                <VStack>
                  <Icon as={FiTrendingUp} boxSize={8} color="purple.500" />
                  <Text fontWeight="bold">Innovation</Text>
                  <Text textAlign="center" fontSize="sm" color="gray.600">
                    Constantly improving to meet user needs.
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Team Section */}
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Meet the Team
              </Heading>
              <HStack spacing={6}>
                <VStack>
                  <Avatar name="Raja Hazwan" src="/john.jpg" size="lg" />
                  <Text fontWeight="bold">Raja Hazwan</Text>
                  <Text fontSize="sm" color="gray.600">
                    Founder & CEO
                  </Text>
                </VStack>
                <VStack>
                  <Avatar name="Omar Haziq" src="/jane.jpg" size="lg" />
                  <Text fontWeight="bold">Omar Haziq</Text>
                  <Text fontSize="sm" color="gray.600">
                    CTO
                  </Text>
                </VStack>
              </HStack>
            </Box>

            <Divider />

            {/* Call-to-Action Section */}
            <Box textAlign="center">
              <Heading as="h2" size="lg" mb={4}>
                Ready to Join Us?
              </Heading>
              <Text fontSize="md" color="gray.700" mb={6}>
                Be a part of our growing community and share your voice with like-minded individuals!
              </Text>
              <Button as={Link} href="/" colorScheme="blue" size="lg">
                Get Started
              </Button>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
