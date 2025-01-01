import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import PageContent from "@/pages/components/Layout/PageContent";
import PostItem from "@/pages/components/Posts/PostItem";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { Post } from "@/atoms/postsAtom";
import About from "@/pages/components/Community/About";
import useCommunityData from "@/hooks/useCommunityData";
import Comments from "@/pages/components/Posts/Comments/Comments";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onDeletePost, onVote } = usePosts();
  const router = useRouter();
  const { communityStateValue } = useCommunityData();

  // Add loading state
  const [loading, setLoading] = useState(false);

  const fetchPost = async (postId: string) => {
    setLoading(true); // Start loading
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);

      if (postDoc.exists()) {
        const fetchedPost = { id: postDoc.id, ...postDoc.data() } as Post;

        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: fetchedPost,
        }));
      } else {
        console.log("Post does not exist");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false); // Stop loading after fetching post
    }
  };

  useEffect(() => {
    const { pid } = router.query;

    // Check if a new post needs to be fetched
    if (pid && (!postStateValue.selectedPost || postStateValue.selectedPost.id !== pid)) {
      fetchPost(pid as string);
    }
  }, [router.query]);

  if (loading) {
    // Show loading spinner while fetching post
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
        <Text ml={4}>Loading post...</Text>
      </Flex>
    );
  }

  if (!postStateValue.selectedPost) {
    // Handle case when the post does not exist
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text fontSize="lg" color="red.500">
          The post could not be found.
        </Text>
      </Flex>
    );
  }

  return (
    <PageContent>
      <>
        {/* Post Item */}
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={postStateValue.postVotes.find((item) => item.postId === postStateValue.selectedPost?.id)?.voteValue}
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}

        {/* Comments Section */}
        {postStateValue.selectedPost && (
          <Comments
            user={user as User}
            selectedPost={postStateValue.selectedPost}
            communityId={postStateValue.selectedPost?.communityId as string}
          />
        )}
      </>
      <>
        {/* About Section */}
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};

export default PostPage;
