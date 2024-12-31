import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, firestore } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, Box, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import usePosts from "@/hooks/usePosts";
import PostItem from "@/pages/components/Posts/PostItem";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Post } from "@/atoms/postsAtom";

const ProfilePage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onVote, onDeletePost } = usePosts();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        where("creatorId", "==", user?.uid)
      );
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id, // Map document ID correctly
        ...doc.data(),
      })) as Post[];
      setPostStateValue((prev) => ({
        ...prev,
        posts,
      }));
    } catch (error) {
      console.error("Error fetching user posts: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchUserPosts();
  }, [user]);

  return (
    <Box>
      {/* Profile Header */}
      <Flex direction="column" align="center" bg="gray.100" p={6} borderRadius="md" mb={6}>
        <Avatar size="2xl" name={user?.displayName || user?.email || "User"} src={user?.photoURL || ""} />
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          {user?.displayName || user?.email}
        </Text>
        <Text color="gray.500">Welcome to your profile</Text>
      </Flex>

      {/* User Posts */}
      <Box p={4}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Your Posts
        </Text>
        {loading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : (
          <Stack spacing={4}>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onVote={onVote}
                onDeletePost={onDeletePost}
                userVoteValue={postStateValue.postVotes.find((vote) => vote.postId === post.id)?.voteValue}
                userIsCreator={user?.uid === post.creatorId}
                onSelectPost={() => {
                  router.push(`/r/${post.communityId}/comments/${post.id}`);
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
