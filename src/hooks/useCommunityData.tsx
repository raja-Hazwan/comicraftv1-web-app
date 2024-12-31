import { authModalState } from '@/atoms/authModalAtom';
import { Community, CommunitySnippet, communityState } from '@/atoms/communitiesAtom';
import { auth, firestore } from '@/firebase/clientApp';
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
    if (!user) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
    } else {
      joinCommunity(communityData);
    }
  };

  const getMySnippets = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => doc.data() as CommunitySnippet);

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets,
        snippetsFetched: true,
      }));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      console.error('getMySnippets error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, setCommunityStateValue]);

  const joinCommunity = async (communityData: Community) => {
    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || '',
        isModerator: user?.uid === communityData.creatorId,
      };

      batch.set(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id),
        newSnippet
      );
      batch.update(doc(firestore, 'communities', communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      console.error('joinCommunity error:', err);
    } finally {
      setLoading(false);
    }
  };

  const leaveCommunity = async (communityId: string) => {
    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId));
      batch.update(doc(firestore, 'communities', communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter((snippet) => snippet.communityId !== communityId),
      }));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      console.error('leaveCommunity error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCommunityData = useCallback(
    async (communityId: string) => {
      try {
        const communityDocRef = doc(firestore, 'communities', communityId);
        const communityDoc = await getDoc(communityDocRef);

        if (communityDoc.exists()) {
          setCommunityStateValue((prev) => ({
            ...prev,
            currentCommunity: { id: communityDoc.id, ...communityDoc.data() } as Community,
          }));
        } else {
          console.warn('Community not found');
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        console.error('getCommunityData error:', err);
      }
    },
    [setCommunityStateValue]
  );

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }

    getMySnippets();
  }, [user, getMySnippets, setCommunityStateValue]);

  useEffect(() => {
    const { communityId } = router.query;
    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string);
    }
  }, [router.query, communityStateValue.currentCommunity, getCommunityData]);

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
    error,
  };
};

export default useCommunityData;
