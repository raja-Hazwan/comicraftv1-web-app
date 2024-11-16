import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { firestore } from '@/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { Community } from '@/atoms/communitiesAtom';
import safeJsonStringify from 'safe-json-stringify';
import React from 'react';
import NotFound from "../../components/Community/NotFound";
import Header from "../../components/Community/Header";
import PageContent from '@/pages/components/Layout/PageContent';
import CreatePostLink from '@/pages/components/Community/CreatePostLink';
import Posts from '@/pages/components/Posts/Posts';


type CommunityPageProps = {
    communityData?: Community | null;
    error?: string;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData, error }) => {
    if (error) {
        return <div>{error}</div>;
    }

    if (!communityData) {
        return <NotFound />;
    }

    return (
    <>
        <Header communityData={communityData}/>
        <PageContent>
               <>
               <CreatePostLink />
               <Posts communityData={communityData} />
               </>
               <>
               <div>RHS</div>
               </>
            </PageContent>
    </>

    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const communityId = context.query.communityId as string;
        console.log('Fetching data for community ID:', communityId);

        const communityDocRef = doc(firestore, 'communities', communityId);
        const communityDoc = await getDoc(communityDocRef);

        if (!communityDoc.exists()) {
            console.log('No document found for the given community ID.');
            return {
                props: {
                    communityData: null, // Set communityData to null to render NotFound
                },
            };
        }

        console.log('Community document data:', communityDoc.data());

        return {
            props: {
                communityData: JSON.parse(
                    safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
                ),
            },
        };
    } catch (error) {
        console.log('Error fetching community data:', error);
        return {
            props: {
                error: "Error fetching community data",
            },
        };
    }
}

export default CommunityPage;
