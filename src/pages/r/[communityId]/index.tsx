import { GetServerSidePropsContext } from 'next';
import { firestore } from '@/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { Community, communityState } from '@/atoms/communitiesAtom';
import safeJsonStringify from 'safe-json-stringify';
import React, { useEffect } from 'react';
import NotFound from "../../components/Community/NotFound";
import Header from "../../components/Community/Header";
import PageContent from '@/pages/components/Layout/PageContent';
import CreatePostLink from '@/pages/components/Community/CreatePostLink';
import Posts from '@/pages/components/Posts/Posts';
import { useRecoilState } from 'recoil';
import About from '@/pages/components/Community/About';

type CommunityPageProps = {
    communityData?: Community | null;
    error?: string;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData, error }) => {
    const [, setCommunityStateValue] = useRecoilState(communityState);

    useEffect(() => {
        if (communityData) {
            setCommunityStateValue((prev) => ({
                ...prev,
                currentCommunity: communityData,
            }));
        }
    }, [communityData, setCommunityStateValue]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!communityData) {
        return <NotFound />;
    }

    return (
        <>
            <Header communityData={communityData} />
            <PageContent>
                <>
                    <CreatePostLink />
                    <Posts communityData={communityData} />
                </>
                <>
                    <About communityData={communityData} />
                </>
            </PageContent>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const communityId = context.query.communityId as string;

        const communityDocRef = doc(firestore, 'communities', communityId);
        const communityDoc = await getDoc(communityDocRef);

        if (!communityDoc.exists()) {
            return {
                props: {
                    communityData: null, // Render NotFound
                },
            };
        }

        return {
            props: {
                communityData: JSON.parse(
                    safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
                ),
            },
        };
    } catch (error) {
        console.error('Error fetching community data:', error);
        return {
            props: {
                error: "Error fetching community data",
            },
        };
    }
}

export default CommunityPage;
