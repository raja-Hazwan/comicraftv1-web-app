import { Post, postState } from '@/atoms/postsAtom';
import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React, { useEffect, useState, useCallback } from 'react';
import CommentInput from './CommentInput';
import { collection, doc, getDocs, increment, orderBy, query, serverTimestamp, Timestamp, where, writeBatch } from 'firebase/firestore';
import { firestore } from '@/firebase/clientApp';
import { useSetRecoilState } from 'recoil';
import CommentItem, { Comment } from './CommentItem';

type CommentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({ user, selectedPost, communityId }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState('');
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async () => {
    if (!selectedPost) return;

    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      // Create a comment document
      const commentDocRef = doc(collection(firestore, 'comments'));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email?.split('@')[0] ?? 'Unknown User',
        communityId,
        postId: selectedPost.id,
        postTitle: selectedPost.title ?? 'Untitled',
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);

      // Update post numberOfComments
      const postDocRef = doc(firestore, 'posts', selectedPost.id);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      // Update client state
      setCommentText('');
      setComments((prev) => [newComment, ...prev]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: (prev.selectedPost?.numberOfComments ?? 0) + 1,
        } as Post,
      }));
    } catch (error) {
      console.error('onCreateComment error', error);
    }
    setCreateLoading(false);
  };

  const onDeleteComment = async (comment: Comment) => {
    if (!selectedPost) return;

    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);

      // Delete a comment document
      const commentDocRef = doc(firestore, 'comments', comment.id);
      batch.delete(commentDocRef);

      // Update post numberOfComments
      const postDocRef = doc(firestore, 'posts', selectedPost.id);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      // Update client state
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: (prev.selectedPost?.numberOfComments ?? 0) - 1,
        } as Post,
      }));
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error) {
      console.error('onDeleteComment error', error);
    }
    setLoadingDeleteId('');
  };

  const getPostComments = useCallback(async () => {
    if (!selectedPost) return;

    setFetchLoading(true);
    try {
      const commentsQuery = query(
        collection(firestore, 'comments'),
        where('postId', '==', selectedPost.id),
        orderBy('createdAt', 'desc')
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(comments);
    } catch (error) {
      console.error('getPostComments error', error);
    }
    setFetchLoading(false);
  }, [selectedPost]);

  useEffect(() => {
    getPostComments();
  }, [selectedPost, getPostComments]);

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
      <Flex direction="column" pl={10} pr={4} mb={6} fontSize="10pt" width="100%">
        {!fetchLoading && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          [0, 1, 2].map((item) => (
            <Box key={item} padding="6" bg="white">
              <SkeletonCircle size="10" />
              <SkeletonText mt="4" noOfLines={2} spacing="4" />
            </Box>
          ))
        ) : comments.length === 0 ? (
          <Flex
            direction="column"
            justify="center"
            align="center"
            borderTop="1px solid"
            borderColor="gray.100"
            p={20}
          >
            <Text fontWeight={700} opacity={0.3}>
              No Comments Yet
            </Text>
          </Flex>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDeleteComment={onDeleteComment}
              loadingDelete={loadingDeleteId === comment.id}
              userId={user.uid}
            />
          ))
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
