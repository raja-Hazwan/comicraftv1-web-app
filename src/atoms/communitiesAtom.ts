import {atom} from "recoil";
import { Timestamp } from "firebase/firestore"; // Import Timestamp from Firestore


export interface Community {
    id: string;
    creatorId: string;
    numberOfMembers: number;
    privacyType: "public" | "restricted"|"private";
    createdAt?: Timestamp;
    imageURL?: string;

    
}