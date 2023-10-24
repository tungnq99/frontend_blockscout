import { Button, Flex, Heading } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useHasAccount from 'lib/hooks/useHasAccount';
import LatestDeposits from 'ui/home/LatestDeposits';
import LatestTxs from 'ui/home/LatestTxs';
import LatestWatchlistTxs from 'ui/home/LatestWatchlistTxs';
import TabsWithScroll from 'ui/shared/Tabs/TabsWithScroll';
import LinkInternal from 'ui/shared/LinkInternal';
import { route } from 'nextjs-routes';
import Icon from 'ui/shared/chakra/Icon';
import arrowRightIcon from "icons/arrows/east.svg";

const TransactionsHome = () => {
  const hasAccount = useHasAccount();
  if (config.features.rollup.isEnabled || hasAccount) {
    const tabs = [
      { id: 'txn', title: 'Latest txn', component: <LatestTxs/> },
      config.features.rollup.isEnabled && { id: 'deposits', title: 'Deposits (L1→L2 txn)', component: <LatestDeposits/> },
      hasAccount && { id: 'watchlist', title: 'Watch list', component: <LatestWatchlistTxs/> },
    ].filter(Boolean);
    return (
      <>
        <Heading as="h4" size="sm" mb={ 4 }>Transactions</Heading>
        <TabsWithScroll tabs={ tabs } lazyBehavior="keepMounted"/>
      </>
    );
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems='flex-start'>
          <Heading as="h4" size="md" mb={ 4 }>Latest Transactions</Heading>
          <LinkInternal fontSize="sm" href={ route({ pathname: '/txs' })} p={1} px={2} border="1px solid" borderRadius="4px" _hover={{ textDecoration : "none", color:"blue.400"}}>
              View all
          </LinkInternal>
      </Flex>
      
      <LatestTxs/>
    </>
  );
};

export default TransactionsHome;
