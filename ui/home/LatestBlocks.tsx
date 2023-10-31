import { Box, Heading, Flex, Text, VStack, Skeleton, Button, Icon } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';
import arrowRightIcon from "icons/arrows/east.svg";
import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import { nbsp } from 'lib/html-entities';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { HOMEPAGE_STATS } from 'stubs/stats';
import LinkInternal from 'ui/shared/LinkInternal';

import LatestBlocksItem from './LatestBlocksItem';

const BLOCK_HEIGHT_L1 = 166;
const BLOCK_HEIGHT_L2 = 112;
const BLOCK_MARGIN = 12;

const LatestBlocks = () => {
  const blockHeight = config.features.rollup.isEnabled || config.UI.views.block.hiddenFields?.total_reward ? BLOCK_HEIGHT_L2 : BLOCK_HEIGHT_L1;
  const isMobile = useIsMobile();
  // const blocksMaxCount = isMobile ? 2 : 3;
  let blocksMaxCount: number;
  if (config.features.rollup.isEnabled || config.UI.views.block.hiddenFields?.total_reward) {
    blocksMaxCount = isMobile ? 4 : 5;
  } else {
    blocksMaxCount = isMobile ? 2 : 3;
  }
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_blocks', {
    queryOptions: {
      placeholderData: Array(blocksMaxCount).fill(BLOCK),
    },
  });

  const queryClient = useQueryClient();
  const statsQueryResult = useApiQuery('homepage_stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('homepage_blocks'), (prevData: Array<Block> | undefined) => {

      const newData = prevData ? [ ...prevData ] : [];

      if (newData.some((block => block.height === payload.block.height))) {
        return newData;
      }

      return [ payload.block, ...newData ].sort((b1, b2) => b2.height - b1.height).slice(0, blocksMaxCount);
    });
  }, [ queryClient, blocksMaxCount ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: isPlaceholderData || isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  let content;

  if (isError) {
    content = <Text>No data. Please reload page.</Text>;
  }

  if (data) {
    const dataToShow = data.slice(0, blocksMaxCount);
    const blocksCount = dataToShow.length;

    content = (
      <>
        { statsQueryResult.data?.network_utilization_percentage !== undefined && (
          <Skeleton isLoaded={ !statsQueryResult.isPlaceholderData } mb={{ base: 6, lg: 3 }} display="inline-block">
            <Text as="span" fontSize="sm">
              Network utilization:{ nbsp }
            </Text>
            <Text as="span" fontSize="sm" color="blue.400" fontWeight={ 700 }>
              { statsQueryResult.data?.network_utilization_percentage.toFixed(2) }%
            </Text>
          </Skeleton>
        ) }
        <VStack spacing={ `${ BLOCK_MARGIN }px` } mb={ 4 } height={ `${ blockHeight * blocksCount + BLOCK_MARGIN * (blocksCount - 1) }px` } overflow="hidden">
          <AnimatePresence initial={ false } >
            { dataToShow.map(((block, index) => (
              <LatestBlocksItem
                key={ block.height + (isPlaceholderData ? String(index) : '') }
                block={ block }
                h={ blockHeight }
                isLoading={ isPlaceholderData }
              />
            ))) }
          </AnimatePresence>
        </VStack>
      </>
    );
  }

  return (
    <Box >
      <Flex justifyContent="space-between" alignItems='flex-start'>
          <Heading as="h4" size="md" mb={ 4 }>Latest Blocks</Heading>
          <LinkInternal fontSize="sm" href={ route({ pathname: '/blocks' })} p={1} px={2} border="1px solid" borderRadius="4px" _hover={{ textDecoration : "none", color:"blue.400"}}>
              View all
          </LinkInternal>
      </Flex>
      { content }
    </Box>
  );
};

export default LatestBlocks;
