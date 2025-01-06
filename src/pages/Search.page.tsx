import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { firestore } from '@/firebase/clientApp';
import PostItem from '@/pages/components/Posts/PostItem';
import { Post } from '@/atoms/postsAtom';

type Community = {
  id: string;
  numberOfMembers: number;
  privacyType: string;
};

const Search: React.FC = () => {
  const router = useRouter();
  const { query: queryParams } = router;
  const searchTerm = queryParams.query as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch communities
  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const communitiesCollection = collection(firestore, 'communities');
      const communityDocs = await getDocs(communitiesCollection);
      const fetchedCommunities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Community[];
      setCommunities(fetchedCommunities);
    } catch (error: any) {
      console.error('Error fetching communities:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch posts and communities based on search term
  const fetchPostsAndCommunities = useCallback(async () => {
    if (!searchTerm) return;

    setLoading(true);
    try {
      // Fetch posts
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

      // Fetch communities by ID (exact match)
      const communityQuery = query(
        collection(firestore, 'communities'),
        where('id', '==', searchTerm)
      );

      const communityDocs = await getDocs(communityQuery);
      const communitiesData = communityDocs.docs.map((doc) => ({
        id: doc.id,
        numberOfMembers: doc.data().numberOfMembers || 0,
        privacyType: doc.data().privacyType || 'public',
      }));

      setCommunities(communitiesData);
    } catch (error) {
      console.error('Error fetching posts and communities:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchCommunities(); // Fetch communities initially
    fetchPostsAndCommunities(); // Fetch posts and communities based on search term
  }, [fetchCommunities, fetchPostsAndCommunities]);

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
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => router.push(`/r/${community.id}`)}
                >
                  <Text fontSize="lg" fontWeight="bold">
                    {community.id}
                  </Text>
                  <Text fontSize="sm">{community.numberOfMembers} members</Text>
                  <Text fontSize="sm" color="gray.500">
                    {community.privacyType}
                  </Text>
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
                  onVote={() => {}} // Replace with actual onVote functionality
                  onDeletePost={() => Promise.resolve(true)} // No delete functionality for search
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
