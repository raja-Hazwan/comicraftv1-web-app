// File: /pages/trending.tsx
import { Post } from '@/atoms/postsAtom';
import { auth, firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import React, { useEffect, useState, useCallback } from 'react';
import PostItem from './components/Posts/PostItem'; // Adjusted the import path
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, Stack, Alert, Text, Heading } from '@chakra-ui/react';
import PostLoader from './components/Posts/PostLoader'; // Adjusted the import path

const Trending: React.FC = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost } = usePosts();

  const getTrendingPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous error

      // Query trending posts: assuming "voteStatus" determines trending
      const trendingPostsQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        orderBy('createdAt', 'desc'), // Secondary sorting by creation date
        limit(100)
      );

      const postDocs = await getDocs(trendingPostsQuery);

      if (!postDocs.empty) {
        // Map Firestore docs to post objects
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        // Update state with trending posts
        setPostStateValue((prev) => ({
          ...prev,
          posts,
        }));
      } else {
        setPostStateValue((prev) => ({
          ...prev,
          posts: [], // No posts found
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
  }, [setPostStateValue]);

  useEffect(() => {
    getTrendingPosts();
  }, [getTrendingPosts]);

  return (
    <Box maxW="800px" mx="auto" px={4} py={6}>
      <Heading as="h1" size="lg" mb={4} textAlign="center">
        Trending Posts
      </Heading>
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
