import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { Box, Flex, Icon, Image, Spinner, Stack, Text } from "@chakra-ui/react";
import { GiQuillInk } from "react-icons/gi";
import { useRouter } from "next/router";

type Community = {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  numberOfMembers: number;
  imageURL?: string;
};

const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const communitiesCollection = collection(firestore, "communities");
      const communityDocs = await getDocs(communitiesCollection);
      const fetchedCommunities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Community[];
      setCommunities(fetchedCommunities);
    } catch (error: any) {
      console.error("Error fetching communities:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <Flex direction="column" p={4} ml={4} mr={4}>
      <Stack spacing={4} direction={{ base: "column", md: "row" }} flexWrap="wrap">
        {loading ? (
          <Stack mt={2} p={3}>
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <Flex key={index} justify="space-between" align="center">
                <Spinner size="sm" />
                <Spinner size="sm" />
              </Flex>
            ))}
          </Stack>
        ) : (
          communities.length === 0 ? (
            <Text>No communities found.</Text>
          ) : (
            communities.map((item) => (
              <Box key={item.id} p={4} borderRadius="md"
                bg="white" // Set background color to white
                boxShadow="md" // Add box shadow for a subtle effect
                _hover={{ boxShadow: "lg", cursor: "pointer" }} // Increase shadow on hover
                onClick={() => router.push(`/community/${item.id}`)}
                width={{ base: "100%", sm: "calc(50% - 16px)", md: "calc(33.33% - 16px)" }}
                mx="8px" my="8px">
                <Flex direction="column" align="center">
                  {item.imageURL ? (
                    <Image src={item.imageURL} alt={`${item.name} Image`} boxSize="80px" borderRadius="full" mb={2} />
                  ) : (
                    <Icon as={GiQuillInk} fontSize={30} color="gold" mb={2} />
                  )}
                  <Text fontSize="md" fontWeight="bold" textAlign="center">{`r/${item.id}`}</Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">{item.numberOfMembers} Members</Text>
                  {item.description && (
                    <Text mt={2} color="gray.600" noOfLines={2} textAlign="center">{item.description}</Text>
                  )}
                </Flex>
              </Box>
            ))
          )
        )}
      </Stack>
    </Flex>
  );
};

export default Communities;
