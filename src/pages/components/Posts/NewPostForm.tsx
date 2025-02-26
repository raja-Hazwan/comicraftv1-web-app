import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { IoDocumentText } from "react-icons/io5";
import TabItem from "./TabItem";
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { Post } from '@/atoms/postsAtom';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@/firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import useSelectFile from '@/hooks/useSelectFile';

// Define the renamed type to avoid conflict with the TabItem component
export type TabItemType = {
    title: string;
    icon: typeof Icon.arguments;
};

type NewPostFormProps = {
    user: User;
    communityImageUrl?: string;
};

const formTabs: TabItemType[] = [
    {
        title: "Post",
        icon: IoDocumentText
    },
    {
        title: "Images Only", // Renamed from "Images & Video"
        icon: IoDocumentText
    },
   
];

const NewPostForm: React.FC<NewPostFormProps> = ({ user, communityImageUrl }) => {
    const router = useRouter();
    const [selectedTab, setSelectTab] = useState(formTabs[0].title);
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
    });
    const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleCreatePost = async () => {
        const { communityId } = router.query;

        // Create a new post object (without the 'id' field here)
        const newPost: Post = {
            communityId: communityId as string,
            communityImageURL: communityImageUrl || '',
            creatorId: user.uid,
            creatorDisplayname: user.email!.split("@")[0],
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            createdAt: serverTimestamp() as Timestamp,
            id: '', // We'll set the 'id' after it's created
        };

        setLoading(true);
        try {
            // Store the post in Firestore and automatically generate the ID
            const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

            // Now that we have the ID, update the post document with the generated ID
            await updateDoc(postDocRef, {
                id: postDocRef.id,
            });

            // Check if selectedFile exists, if it does, upload it to Firebase storage
            if (selectedFile) {
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedFile, "data_url");
                const downloadURL = await getDownloadURL(imageRef);

                // Update the post with the image URL
                await updateDoc(postDocRef, {
                    imageURL: downloadURL,
                });
            }

            // Redirect the user back to the community page
            router.back();
        } catch (error: unknown) {
            // Safe error handling
            if (error instanceof Error) {
                console.log("handleCreatePost error", error.message);
            } else {
                console.log("Unexpected error", error);
            }
            setError(true);
        }
        setLoading(false);
    };

    const OnTextChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { target: { name, value } } = event;
        setTextInputs((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
            <Flex width="100%">
                {formTabs.map((item) => (
                    <TabItem
                        key={item.title}
                        item={item}
                        selected={item.title === selectedTab}
                        setSelectedTab={setSelectTab}
                    />
                ))}
            </Flex>
            <Flex p={4}>
                {selectedTab === "Post" && (
                    <TextInputs
                        textInputs={textInputs}
                        handleCreatePost={handleCreatePost}
                        onChange={OnTextChange}
                        loading={loading}
                    />
                )}
                {selectedTab === 'Images Only' && <ImageUpload
                    selectedFile={selectedFile}
                    onSelectImage={onSelectFile}
                    setSelectedTab={setSelectTab}
                    setSelectedFile={setSelectedFile}
                />}
            </Flex>
            {error && (
                <Alert status="error">
                    <AlertIcon />
                    <Text mr={2}>Error in creating post</Text>
                </Alert>
            )}
        </Flex>
    );
};

export default NewPostForm;
