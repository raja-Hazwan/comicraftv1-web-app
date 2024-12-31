import { Post, postState, PostVote } from '@/atoms/postsAtom';
import { auth, firestore, storage } from '@/firebase/clientApp';
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import React, { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useAuthState } from 'react-firebase-hooks/auth';
import { communityState } from '@/atoms/communitiesAtom';
import { useRouter } from 'next/router';

const usePosts = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const currentCommunity = useRecoilValue(communityState).currentCommunity;

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation();

    if (!user?.uid) {
      console.error('User not authenticated. Opening auth modal...');
      setAuthModalState({ open: true, view: 'login' });
      return;
    }

    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find((v) => v.postId === post.id);

      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      if (!existingVote) {
        // New vote
        const postVoteRef = doc(collection(firestore, 'users', `${user.uid}/postVotes`));

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id,
          communityId,
          voteValue: vote,
        };

        batch.set(postVoteRef, newVote);

        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        const postVoteRef = doc(firestore, 'users', `${user.uid}/postVotes/${existingVote.id}`);

        if (existingVote.voteValue === vote) {
          // Removing the existing vote
          voteChange *= -1;
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter((v) => v.id !== existingVote.id);

          batch.delete(postVoteRef);
        } else {
          // Changing the vote direction
          voteChange = 2 * vote;
          updatedPost.voteStatus = voteStatus + voteChange;

          const voteIdx = postStateValue.postVotes.findIndex((v) => v.id === existingVote.id);

          if (voteIdx !== -1) {
            updatedPostVotes[voteIdx] = {
              ...existingVote,
              voteValue: vote,
            };

            batch.update(postVoteRef, { voteValue: vote });
          }
        }
      }

      const postIdx = postStateValue.posts.findIndex((item) => item.id === post.id);

      if (postIdx !== -1) {
        updatedPosts[postIdx] = updatedPost;
      }

      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }

      const postRef = doc(firestore, 'posts', post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      await batch.commit();
      console.log('Vote successfully updated.');
    } catch (err) {
      console.error('Error in onVote:', err);
    }
  };

  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      const postDocRef = doc(firestore, 'posts', post.id!);
      await deleteDoc(postDocRef);

      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));

      return true;
    } catch (err) {
      console.error('Error in onDeletePost:', err);
      return false;
    }
  };

  const getCommunityPostVote = useCallback(
    async (communityId: string) => {
      try {
        const postVotesQuery = query(
          collection(firestore, `users/${user?.uid}/postVotes`),
          where('communityId', '==', communityId)
        );

        const postVoteDocs = await getDocs(postVotesQuery);
        const postVotes = postVoteDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostStateValue((prev) => ({
          ...prev,
          postVotes: postVotes as PostVote[],
        }));
      } catch (err) {
        console.error('Error in getCommunityPostVote:', err);
      }
    },
    [user, setPostStateValue]
  );

  useEffect(() => {
    if (!user || !currentCommunity?.id) return;
    getCommunityPostVote(currentCommunity?.id);
  }, [user, currentCommunity, getCommunityPostVote]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};

export default usePosts;

function setAuthModalState(arg0: { open: boolean; view: string }) {
  console.log('Set auth modal state called:', arg0);
}
