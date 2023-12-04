import { Box, Heading, Flex, LightMode } from '@chakra-ui/react';
import React from 'react';

import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestBlocks from 'ui/home/LatestBlocks';
import Transactions from 'ui/home/Transactions';

import SearchBar from 'ui/snippets/searchBar/SearchBar';

const Home = () => {
  return (
    <>
      
      <Box
        w="100%"
        data-label="hero plate"
      >
        <SearchBar isHomepage/>
      </Box>
      {/* <AdBanner mt={{ base: 6, lg: 8 }} mx="auto" display="flex" justifyContent="center"/> */}
      
      <ChainIndicators/>
      
      <Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 8 } rowGap={ 8 }>
        <Box boxShadow="lg" w={{base: '100%', lg: "35%"}} p={5} borderRadius={8}>
          <LatestBlocks />
        </Box>
        <Box  boxShadow="lg"  p={5} borderRadius={8} w={{base: '100%', lg: "65%"}}>
          <Transactions/>
        </Box>
      </Flex>
    </>
  );
};

export default Home;
