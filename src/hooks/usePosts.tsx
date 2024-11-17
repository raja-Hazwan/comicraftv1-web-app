import { Post, postState, PostVote } from '@/atoms/postsAtom';
import { auth, firestore, storage } from '@/firebase/clientApp';
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useAuthState } from "react-firebase-hooks/auth";
import { communityState } from '@/atoms/communitiesAtom';
import { useRouter } from 'next/router';

const usePosts = () => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [postStateValue, setPostStateValue] = useRecoilState(postState)
    const currentCommunity = useRecoilValue(communityState).currentCommunity;
   
    const onVote = async (
        event: React.MouseEvent<SVGElement,  MouseEvent>,
        post: Post, 
        vote: number, 
        communityId: string) => {
            event.stopPropagation();

        if (!user?.uid) {
            console.error("User not authenticated. Opening auth modal...");
            // Open authentication modal if user is not logged in
            setAuthModalState({ open: true, view: "login" });
            return;
        }
    
        try {
            const { voteStatus } = post;
            const existingVote = postStateValue.postVotes.find(
                (v) => v.postId === post.id
            );
    
            const batch = writeBatch(firestore);
            const updatedPost = { ...post };
            const updatedPosts = [...postStateValue.posts];
            let updatedPostVotes = [...postStateValue.postVotes];
            let voteChange = vote;
    
            if (!existingVote) {
                // New vote
                const postVoteRef = doc(
                    collection(firestore, "users", `${user.uid}/postVotes`)
                );
    
                const newVote: PostVote = {
                    id: postVoteRef.id,
                    postId: post.id,
                    communityId,
                    voteValue: vote,
                };
    
                // Add the new vote to Firestore
                batch.set(postVoteRef, newVote);
    
                // Update the post's vote status
                updatedPost.voteStatus = voteStatus + vote;
                updatedPostVotes = [...updatedPostVotes, newVote];
            } else {
                const postVoteRef = doc(
                    firestore,
                    "users",
                    `${user.uid}/postVotes/${existingVote.id}`
                );
    
                if (existingVote.voteValue === vote) {
                    // Removing the existing vote
                    voteChange *= -1;
                    updatedPost.voteStatus = voteStatus - vote;
                    updatedPostVotes = updatedPostVotes.filter(
                        (v) => v.id !== existingVote.id
                    );
    
                    // Delete the vote from Firestore
                    batch.delete(postVoteRef);
                } else {
                    // Changing the vote direction
                    voteChange = 2 * vote;
                    updatedPost.voteStatus = voteStatus + voteChange;
    
                    const voteIdx = postStateValue.postVotes.findIndex(
                        (v) => v.id === existingVote.id
                    );
    
                    if (voteIdx !== -1) {
                        updatedPostVotes[voteIdx] = {
                            ...existingVote,
                            voteValue: vote,
                        };
    
                        // Update the existing vote in Firestore
                        batch.update(postVoteRef, { voteValue: vote });
                    }
                }
            }
    
            // Update the post array with the modified post
            const postIdx = postStateValue.posts.findIndex(
                (item) => item.id === post.id
            );
    
            if (postIdx !== -1) {
                updatedPosts[postIdx] = updatedPost;
            }
    
            // Update the Recoil state
            setPostStateValue((prev) => ({
                ...prev,
                posts: updatedPosts,
                postVotes: updatedPostVotes,
            }));

            if(postStateValue.selectedPost) {
                setPostStateValue((prev) =>({
                    ...prev,
                    selectedPost: updatedPost,
                }))
            }
    
            // Update the vote status in the post document in Firestore
            const postRef = doc(firestore, "posts", post.id);
            batch.update(postRef, { voteStatus: voteStatus + voteChange });
    
            // Commit the batch
            await batch.commit();
            console.log("Vote successfully updated.");
        } catch (error) {
            console.error("Error in onVote:", error);
        }
    };
    
      
    const onSelectPost = (post : Post) => {

        setPostStateValue((prev) => ({
            ...prev,
            selectedPost: post,
        }));
        router.push(`/r/${post.communityId}/comments/${post.id}`);
    };

    const onDeletePost = async (post: Post): Promise<boolean> => {
        try {

            // check if theres image
            if (post.imageURL){
                const imageRef = ref(storage, `posts/${post.id}/image`);
                await deleteObject(imageRef);
            }
            // delete post from firestore
            const postDocRef = doc(firestore, 'posts', post.id!);
            await deleteDoc(postDocRef);
            //update recoil state
            setPostStateValue((prev) => ({
             ...prev,
                posts: prev.posts.filter((item) => item.id!== post.id),
            }));
            

            return true;
        } catch (error) {
            return false;
        }
        
    };


const getCommunityPostVote = async (communityId: string) =>{
    const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("communityId", "==", communityId)
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
};
    useEffect(() => {
        if (!user || !currentCommunity?.id)return ;
        getCommunityPostVote(currentCommunity?.id);
    }, [user,currentCommunity]);
    
    return ({
        postStateValue,
        setPostStateValue,
        onVote, 
        onSelectPost,
        onDeletePost,

    })
}
export default usePosts;

function setAuthModalState(arg0: { open: boolean; view: string; }) {
    throw new Error('Function not implemented.');
}
