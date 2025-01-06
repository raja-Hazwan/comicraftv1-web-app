import { SearchIcon } from '@chakra-ui/icons';
import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchTerm.trim() !== '') {
      router.push(`/Search?query=${encodeURIComponent(searchTerm.trim())}`); // Encode search term
    }
  };

  return (
    <Flex
      flexGrow={1}
      maxWidth={user ? 'auto' : '600px'}
      mr={2}
      align="center"
      display={{ base: 'none', md: 'flex' }} // Hide on mobile, show on desktop
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" mb={1} />
        </InputLeftElement>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Track input value
          onKeyDown={handleSearch} // Trigger search on Enter
          placeholder="Search"
          fontSize="10pt"
          _placeholder={{ color: 'gray.500' }}
          _hover={{
            bg: 'white',
            border: '1px solid',
            borderColor: 'blue.500',
          }}
          _focus={{
            outline: 'none',
            border: '1px solid',
            borderColor: 'blue.500',
          }}
          height="34px"
          bg="gray.50"
        />
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;
