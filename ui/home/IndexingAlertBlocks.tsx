import { Alert, AlertIcon, AlertTitle, Box, chakra, Flex, Skeleton, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { IndexingStatus } from 'types/api/indexingStatus';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import useIsMobile from 'lib/hooks/useIsMobile';
import { nbsp, ndash } from 'lib/html-entities';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import ColorModeToggler from 'ui/snippets/header/ColorModeToggler';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

const IndexingAlertBlocks = ({ className }: { className?: string }) => {
  const {isLoading } = useApiQuery('homepage_indexing_status');

  if (isLoading) {
    return <Skeleton h={{ base: '96px', lg: '48px' }} mb={ 6 } w="100%" className={ className }/>;
  }

  return (
     <Flex flexWrap="wrap" justifyContent="space-between" alignItems="center" mb={ 6 }>
      <Text fontSize={{base: '2xl', lg: '3xl'}} fontWeight={600}>BlockChain Explorer</Text>
      <Box display={{ base: 'none', lg: 'block' }}><NetworkAddToWallet /></Box>
    </Flex>
  );
};

export default chakra(IndexingAlertBlocks);
