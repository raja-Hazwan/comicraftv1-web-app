import React, { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';

type PageContentProps = {
  children?: ReactNode;
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <Flex justify="center" p="16px 0px" border="solid red">
      <Flex width="95%" justify="center" maxWidth="860px" border="solid yellow">
        {/* LHS */}
        <Flex 
        direction="column"
        width={{ base: "100%", md: "65%" }}
        mr={{ base: 0, md: 6 }} 
        border="solid blue"
        >
            
        {children && children[0 as keyof typeof children]}
        </Flex>

        {/* RHS */}
        <Flex 
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        flexGrow={1}
        border="solid orange">
            {children && children[1 as keyof typeof children]}
            </Flex>
      </Flex>
    </Flex>
  );
};

export default PageContent;
