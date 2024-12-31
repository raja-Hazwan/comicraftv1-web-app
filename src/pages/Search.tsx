import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { firestore } from '@/firebase/clientApp';
import PostItem from '@/pages/components/Posts/PostItem';
import { Post } from '@/atoms/postsAtom';

const Search: React.FC = () => {
  const router = useRouter();
  const { query: queryParams } = router;
  const searchTerm = queryParams.query as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    if (!searchTerm) return;

    setLoading(true);
    try {
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
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(); // Trigger fetch whenever the search term changes
  }, [searchTerm]);

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={5}>
        Search Results for "{searchTerm}"
      </Text>
      {loading ? (
        <Spinner />
      ) : posts.length > 0 ? (
        <Flex direction="column" gap={4}>
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              userIsCreator={false}
              onVote={() => {}} // Replace with actual onVote functionality
              onDeletePost={() => Promise.resolve(true)} // No delete functionality for search
              onSelectPost={(post) => router.push(`/r/${post.communityId}/comments/${post.id}`)} // Navigate to post detail
              userVoteValue={0}
            />
          ))}
        </Flex>
      ) : (
        <Text>No posts found.</Text>
      )}
    </Box>
  );
};

export default Search;
