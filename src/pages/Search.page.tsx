import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { firestore } from '@/firebase/clientApp';
import PostItem from '@/pages/components/Posts/PostItem';
import { Post } from '@/atoms/postsAtom';
import { Icon } from '@chakra-ui/react';
import { GiQuillInk } from 'react-icons/gi';
import { Image } from '@chakra-ui/react';

type Community = {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  numberOfMembers: number;
  imageURL?: string;
  privacyType: string;
};

const Search: React.FC = () => {
  const router = useRouter();
  const { query: queryParams } = router;
  const searchTerm = queryParams.query as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch posts and communities based on search term
  const fetchPostsAndCommunities = useCallback(async () => {
    if (!searchTerm) return;

    setLoading(true);
    try {
      // Fetch posts - keeping this the same as it works
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('title', '>=', searchTerm),
        where('title', '<=', searchTerm + '\uf8ff')
      );

      const postDocs = await getDocs(postsQuery);
      const postsData = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts(postsData);

      // Fetch all communities first
      const communitiesCollection = collection(firestore, 'communities');
      const communityDocs = await getDocs(communitiesCollection);
      const allCommunities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Community[];

      // Filter communities based on search term
      const filteredCommunities = allCommunities.filter(community => 
        community.id.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setCommunities(filteredCommunities);
    } catch (error) {
      console.error('Error fetching posts and communities:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchPostsAndCommunities();
  }, [fetchPostsAndCommunities]);

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={5}>
        Search Results for "{searchTerm}"
      </Text>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Communities Section */}
          <Text fontSize="xl" fontWeight="bold" mt={5}>
            Communities
          </Text>
          {communities.length > 0 ? (
            <Flex direction="column" gap={4}>
              {communities.map((community) => (
                <Box
                  key={community.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  cursor="pointer"
                  bg="white"
                  boxShadow="md"
                  _hover={{ boxShadow: "lg" }}
                  onClick={() => router.push(`/r/${community.id}`)}
                >
                  <Flex align="center" gap={4}>
                    {community.imageURL ? (
                      <Image 
                        src={community.imageURL} 
                        alt={`${community.id} community`} 
                        boxSize="50px" 
                        borderRadius="full" 
                      />
                    ) : (
                      <Icon as={GiQuillInk} fontSize={30} color="gold" />
                    )}
                    <Box flex="1">
                      <Text fontSize="lg" fontWeight="bold">
                        r/{community.id}
                      </Text>
                      <Text fontSize="sm">{community.numberOfMembers} members</Text>
                      {community.description && (
                        <Text fontSize="sm" color="gray.500" noOfLines={2}>
                          {community.description}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Flex>
          ) : (
            <Text>No communities found.</Text>
          )}

          {/* Posts Section */}
          <Text fontSize="xl" fontWeight="bold" mt={10}>
            Posts
          </Text>
          {posts.length > 0 ? (
            <Flex direction="column" gap={4}>
              {posts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  userIsCreator={false}
                  onVote={() => {}}
                  onDeletePost={() => Promise.resolve(true)}
                  onSelectPost={(post) => router.push(`/r/${post.communityId}/comments/${post.id}`)}
                  userVoteValue={0}
                />
              ))}
            </Flex>
          ) : (
            <Text>No posts found.</Text>
          )}
        </>
      )}
    </Box>
  );
};

export default Search;