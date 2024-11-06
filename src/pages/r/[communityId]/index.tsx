import React from 'react';
import {GetServerSideProps, GetServerSidePropsContext } from 'next';
import { firestore } from '@/firebase/clientApp';
import { doc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore/lite';
import { Community } from '@/atoms/communitiesAtom';
import safeJsonStringify from 'safe-json-stringify';

type CommunityPageProps = {
    communityData: Community;
};

const CommunityPage:React.FC<CommunityPageProps> = ({communityData}) => {
    
    console.log('DAMN THIS IS THE DATA', communityData)
    return <div>WELCOME TO {communityData.id}</div>;
};


export async function getServerSideProps(context: GetServerSidePropsContext){

    // get community data and past it to client side
    try {
        const communityDocRef = doc(
            firestore,
            'communities',
            context.query.communityId as string);
            const communityDoc = await getDoc(communityDocRef);


            return{
                props:{
                    communityData: JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }))
                }
            }
    } 
    
    catch (error) {
        //could add error page but did'nt do it
        console.log('getServerSideProps error',error);
    }
}
export default CommunityPage;