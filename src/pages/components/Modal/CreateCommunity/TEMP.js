// // Option for nosql

// const COMMUNITY = {
//     id: "commId",
//     /**
//      * 
//      * 
//      * 
//      */


//     users: ["userId1", "userId2", "userId3",".......","userId11294309"]

// };

// const USER = {
//     id: "userId",
//     /**
//      * 
//      * 
//      * 
//      */

//         communities: ["commId1", "commId2", "commId3"],

// };

// Option for sql approach
// const USER_COMMUNITY = {  
//     userId:'userId',
//     communityId:'commId'  

// }


// Option 3
const USER = {
    id: "userId",
    communitySnippets: [
        { communityId: "commId1" },
        { communityId: "commId2" },
        { communityId: "commId10" },
    ],
};

const COMMUNITY = {
    id: "commId",
    numOfMembers: "23947230472389245093480594387",
};

// Temporary usage to avoid linter errors
const tempUse = () => {
    console.log("User Data:", USER);
    console.log("Community Data:", COMMUNITY);
};

tempUse();
