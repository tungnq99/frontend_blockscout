import { Alert, AlertIcon, AlertTitle, chakra, Flex, Skeleton, Text } from '@chakra-ui/react';
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
  const isMobile = useIsMobile();

  const appProps = useAppContext();
  const cookiesString = appProps.cookies;
  const [ hasAlertCookie ] = React.useState(cookies.get(cookies.NAMES.INDEXING_ALERT, cookiesString) === 'true');

  const { data, isError, isLoading } = useApiQuery('homepage_indexing_status');

  React.useEffect(() => {
    if (!isLoading && !isError) {
      cookies.set(cookies.NAMES.INDEXING_ALERT, data.finished_indexing_blocks ? 'false' : 'true');
    }
  }, [ data, isError, isLoading ]);

  const queryClient = useQueryClient();

  const handleBlocksIndexStatus: SocketMessage.BlocksIndexStatus['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('homepage_indexing_status'), (prevData: IndexingStatus | undefined) => {

      const newData = prevData ? { ...prevData } : {} as IndexingStatus;
      newData.finished_indexing_blocks = payload.finished;
      newData.indexed_blocks_ratio = payload.ratio;

      return newData;
    });
  }, [ queryClient ]);

  const blockIndexingChannel = useSocketChannel({
    topic: 'blocks:indexing',
    isDisabled: !data || data.finished_indexing_blocks,
  });

  useSocketMessage({
    channel: blockIndexingChannel,
    event: 'block_index_status',
    handler: handleBlocksIndexStatus,
  });

  if (isError) {
    return null;
  }

  if (isLoading) {
    return hasAlertCookie ? <Skeleton h={{ base: '96px', lg: '48px' }} mb={ 6 } w="100%" className={ className }/> : null;
  }

  if (data.finished_indexing_blocks !== false) {
    return null;
  }

  return (
     <Flex flexWrap="wrap" columnGap={ 8 } rowGap={ 6 } justifyContent="space-between" alignItems="center" mb={ 6 }>
      <Text fontSize={{base: '2xl', lg: '3xl'}} fontWeight={600}>BlockChain Explorer</Text>
      <NetworkAddToWallet/>
    </Flex>
  );
};

export default chakra(IndexingAlertBlocks);
