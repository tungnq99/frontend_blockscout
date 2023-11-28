import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemMobile from './LatestTxsItemMobile';
import useMultiAPI from '../../playwright/utils/useMultiApi';

const LatestTransactions = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 6;
  const { data, isPlaceholderData, isError } = useMultiAPI("main-page/transactions");
  
  const { num, socketAlert } = useNewTxsSocket();

  if (isError || data?.length === 0) {
    return <Text width="100%">No data. Please reload page.</Text>;
  }

  if (data?.length > 0) {
    const txsUrl = route({ pathname: '/txs' });
    return (
      <>
        <SocketNewItemsNotice borderBottomRadius={ 0 } url={ txsUrl } num={ num } alert={ socketAlert } isLoading={ isPlaceholderData }/>
        <Box mb={ 3 } display={{ base: 'block', lg: 'none' }}>
          { data.slice(0, txsCount).map(((tx: any, index: number) => (
            <LatestTxsItemMobile
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </Box>
        <Box mb={ 4 }  display={{ base: 'none', lg: 'block' }}>
          { data.slice(0, txsCount).map(((tx: any, index: number) => (
            <LatestTxsItem
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </Box>
      </>
    );
  }

  return null;
};

export default LatestTransactions;
