import { Community, communityState } from '@/atoms/communitiesAtom';
import { Box, Button, Divider, Flex, Icon, Stack, Text, Image, Spinner } from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '@/firebase/clientApp';
import useSelectFile from '@/hooks/useSelectFile';
import { SiInoreader } from "react-icons/si";
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { selectedFile, onSelectFile } = useSelectFile(); // Removed setSelectedFile as it’s unused
  const [uploadingImage, setUpLoadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(communityState);

  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setUpLoadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageURL: downloadURL,
      });

      console.log("HERE IS DOWNLOAD URL", downloadURL);

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        } as Community,
      }));
    } catch (error) {
      console.log('onUpdateImage error', error);
    }
    setUpLoadingImage(false);
  };

  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="orange.300"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>

      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex align="center" width="100%" p={1} fontWeight={500} fontSize="10pt">
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            <Text>
              Created{' '}
              {moment(new Date(communityData.createdAt!.seconds * 1000)).format(
                'MMM DD, YYYY'
              )}
            </Text>
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button mt={3} height="30px">
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {communityData?.imageURL || selectedFile ? (
                    <Image
                      borderRadius="full"
                      boxSize="40px"
                      src={selectedFile || communityData?.imageURL}
                      alt="Community Image"
                    />
                  ) : (
                    <Icon as={SiInoreader} fontSize={40} color="brand.100" mr={2} />
                  )}
                </Flex>

                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor="pointer" onClick={onUpdateImage}>
                      Save Changes
                    </Text>
                  ))}

                <input
                  id="file-upload"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  hidden
                  ref={selectedFileRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default About;
