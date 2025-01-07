import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/clientApp';
import React, { useEffect, useState, useCallback } from 'react';
import { Post } from '@/atoms/postsAtom';
import PostItem from './components/Posts/PostItem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, Stack, Alert, Text, Heading, Flex, Icon, Button } from '@chakra-ui/react';
import PostLoader from './components/Posts/PostLoader';
import { FaFire } from 'react-icons/fa';
import usePosts from '@/hooks/usePosts';

const Trending: React.FC = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'today'>('all');
  const { postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost } = usePosts();

  const getTrendingPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let startDate: Date | undefined;
      if (timeFilter === 'month') {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (timeFilter === 'today') {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
      }

      let trendingPostsQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );

      if (startDate) {
        trendingPostsQuery = query(trendingPostsQuery, where('createdAt', '>=', startDate));
      }

      const postDocs = await getDocs(trendingPostsQuery);

      if (!postDocs.empty) {
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        setPostStateValue((prev) => ({
          ...prev,
          posts,
        }));
      } else {
        setPostStateValue((prev) => ({
          ...prev,
          posts: [],
        }));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('getTrendingPosts error:', error.message);
        setError('Failed to fetch trending posts. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [setPostStateValue, timeFilter]);

  useEffect(() => {
    getTrendingPosts();
  }, [getTrendingPosts, timeFilter]);

  return (
    <Box maxW="800px" mx="auto" px={4} py={6}>
      <Flex align="center" justify="center" bg="white" p={4} borderRadius="md" mb={6} shadow="sm">
        <Icon as={FaFire} color="red.500" fontSize="2xl" mr={2} />
        <Heading as="h1" size="lg" textAlign="center" color="blackAlpha.800">
          Trending Posts
        </Heading>
        
      </Flex>

      <Flex justify="center" mb={4}>
        <Button
          variant={timeFilter === 'all' ? 'solid' : 'outline'}
          onClick={() => setTimeFilter('all')}
          mr={2}
        >
          All Time
        </Button>
        <Button
          variant={timeFilter === 'month' ? 'solid' : 'outline'}
          onClick={() => setTimeFilter('month')}
          mr={2}
        >
          This Month
        </Button>
        <Button
          variant={timeFilter === 'today' ? 'solid' : 'outline'}
          onClick={() => setTimeFilter('today')}
        >
          Today
        </Button>
      </Flex>

      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          {error}
        </Alert>
      )}
      {loading ? (
        <PostLoader />
      ) : (
        <Stack spacing={6}>
          {postStateValue.posts?.length === 0 ? (
            <Text textAlign="center" fontSize="lg">
              No trending posts to display
            </Text>
          ) : (
            postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                userIsCreator={user?.uid === post.creatorId}
                userVoteValue={postStateValue.postVotes?.find((vote) => vote.postId === post.id)?.voteValue}
                onVote={onVote}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
              />
            ))
          )}
        </Stack>
      )}
    </Box>
  );
};

export default Trending;
