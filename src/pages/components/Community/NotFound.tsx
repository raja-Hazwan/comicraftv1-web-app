import React from 'react';
import { Button, Flex, Box } from "@chakra-ui/react";
import Link from 'next/link';

const CommunityNotFound: React.FC = () => {
    return (
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
            textAlign="center"
        >
            <Box
                bg="white"
                p={8}
                rounded="md"
                shadow="md"
                textAlign="center"
                maxWidth="400px"
                width="100%"
            >
                <Box mb={4}>
                    Sorry, that community does not exist or has been deleted.
                </Box>
                <Flex justifyContent="center">
                    <Link href="/" passHref>
                        <Button mt={4}>GO HOME</Button>
                    </Link>
                </Flex>
            </Box>
        </Flex>
    );
};

export default CommunityNotFound;
