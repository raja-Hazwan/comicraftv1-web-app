import React from "react";
import { Box, Heading, Text, VStack, Stack, Icon, Divider, Container } from "@chakra-ui/react";
import { FiInfo } from "react-icons/fi";

const AboutPage: React.FC = () => {
  return (
    <Box py={10} px={4}>
      {/* Page Title */}
      <VStack spacing={6} textAlign="center" mb={10}>
        <Icon as={FiInfo} boxSize={12} color="blue.500" />
        <Heading as="h1" size="xl">
          About Us
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Welcome to our platform! We aim to provide a community-driven space to share and discuss trending topics, news, and ideas.
        </Text>
      </VStack>

      {/* Content in a white container */}
      <Container maxW="container.md">
        <Box bg="white" p={8} rounded="lg" shadow="md">
          {/* About Content */}
          <Stack spacing={6}>
            <Box>
              <Heading as="h2" size="md" mb={2}>
                Our Mission
              </Heading>
              <Text fontSize="md" color="gray.700">
                Our mission is to connect people through shared interests and meaningful discussions. We want to empower individuals to express themselves and learn from others, building a better community for all.
              </Text>
            </Box>

            <Divider />

            <Box>
              <Heading as="h2" size="md" mb={2}>
                What We Offer
              </Heading>
              <Text fontSize="md" color="gray.700">
                From trending discussions to in-depth insights, our platform curates the best content for our users. Whether you're here to share your ideas, learn something new, or connect with like-minded individuals, we've got you covered!
              </Text>
            </Box>

            <Divider />

            <Box>
              <Heading as="h2" size="md" mb={2}>
                How It Works
              </Heading>
              <Text fontSize="md" color="gray.700">
                Users can create posts, vote on their favorite content, and explore trending topics. The most popular posts rise to the top, ensuring that the best ideas get the recognition they deserve.
              </Text>
            </Box>

            <Divider />

            <Box>
              <Heading as="h2" size="md" mb={2}>
                Get Involved
              </Heading>
              <Text fontSize="md" color="gray.700">
                Join the conversation by creating an account and participating in discussions. We value your input and look forward to building a vibrant community together.
              </Text>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
