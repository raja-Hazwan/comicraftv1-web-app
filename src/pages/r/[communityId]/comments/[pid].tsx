import { auth, firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import PageContent from '@/pages/components/Layout/PageContent';
import PostItem from '@/pages/components/Posts/PostItem';
import router, { useRouter } from 'next/router';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Post } from '@/atoms/postsAtom';
import About from '@/pages/components/Community/About';
import { communityState } from '../../../../atoms/communitiesAtom';
import useCommunityData from '@/hooks/useCommunityData';


const PostPage:React.FC= () => {
    const [user] = useAuthState(auth);
    const { postStateValue, setPostStateValue, onDeletePost,onVote,} =
    usePosts();
    const router = useRouter();
    const {communityStateValue} = useCommunityData();

    const fetchPost = async (postId: string) => {

        try {
            const postDocRef = doc(firestore, 'posts' , postId);
            const postDoc = await getDoc(postDocRef);
            setPostStateValue(prev => ({
                ...prev,
                selectedPost: {id: postDoc.id, ...postDoc.data() }as Post,
            }));

        } catch (error) {
            console.log('fetch post error', error);
        }

    };

    useEffect(() => {
        const {pid} = router.query;
        if (pid && !postStateValue.selectedPost){
            fetchPost(pid as string);
        }
    }, [router.query, postStateValue.selectedPost]);


  return (
    <PageContent>
        <>
        {postStateValue.selectedPost &&<PostItem
                  post={postStateValue.selectedPost}
                  // postIdx={postStateValue.selectedPost.postIdx}
                  onVote={onVote}
                  onDeletePost={onDeletePost}
                  userVoteValue={
                    postStateValue.postVotes.find(
                      (item) => item.postId === postStateValue.selectedPost!.id
                    )?.voteValue
                  }
                  userIsCreator={
                    user?.uid === postStateValue.selectedPost?.creatorId
                  }
               
                />}
             {/* Comments*/}
        </>
        <>
       { communityStateValue.currentCommunity && 
       (<About communityData={communityStateValue.currentCommunity}/>)}
        </>
    </PageContent>
    
  )
};
export default PostPage;