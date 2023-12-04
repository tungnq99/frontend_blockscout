import { Box, Show, Hide, Flex } from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';

import type { AddressFromToFilter } from 'types/api/address';
import { apos } from 'lib/html-entities';
import DataListDisplay from 'ui/shared/DataListDisplay';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import TxsListItem from './TxsListItem';
import TxsTable from './TxsTable';
import getQueryParamString from 'lib/router/getQueryParamString';

//query: QueryWithPagesResult<'txs_validated' | 'txs_pending'> | QueryWithPagesResult<'txs_watchlist'> | QueryWithPagesResult<'block_txs'>
type Props = {
  query: any;
  showBlockInfo?: boolean;
  showSocketInfo?: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
  currentAddress?: string;
  filter?: React.ReactNode;
  filterValue?: AddressFromToFilter;
  enableTimeIncrement?: boolean;
  top?: number;
}

const TxsContent = ({
  filter,
  filterValue,
  query,
  showBlockInfo = true,
  showSocketInfo = true,
  socketInfoAlert,
  socketInfoNum,
  currentAddress,
  enableTimeIncrement,
  top,
}: Props) => {
  const router = useRouter();
  const params: any = new URLSearchParams(window.location.search);
  //const { data, isPlaceholderData, isError, setSortByField, setSortByValue, sorting } = useTxsSort(query);
  const [ filterChain, setFilterChain ] = React.useState(0);
  const {data, isPlaceholderData, isError, callback } = query;
  const [ type, setType ] = React.useState(getQueryParamString(router.query.filter) || undefined);
  
  const content = data ? (
    <>
      <Show below="lg" ssr={ false }>
        <Box>
          { showSocketInfo && (
            <SocketNewItemsNotice.Mobile
              url={ window.location.href }
              num={ socketInfoNum }
              alert={ socketInfoAlert }
              isLoading={ isPlaceholderData }
            />
          ) }
          { data.map((tx: any, index: number) => (
            <TxsListItem
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              showBlockInfo={ showBlockInfo }
              currentAddress={ currentAddress }
              enableTimeIncrement={ enableTimeIncrement }
              isLoading={ isPlaceholderData }
            />
          )) }
        </Box>
      </Show>
      <Hide below="lg" ssr={ false }>
        <TxsTable
          txs={ data }
          showBlockInfo={ showBlockInfo }
          showSocketInfo={ showSocketInfo }
          socketInfoAlert={ socketInfoAlert }
          socketInfoNum={ socketInfoNum }
          top={ top || query.pagination.isVisible ? 80 : 0 }
          currentAddress={ currentAddress }
          enableTimeIncrement={ enableTimeIncrement }
          isLoading={ isPlaceholderData }
        />
      </Hide>
    </>
  ) : null;

  const actionBar = <Flex mb={2}>
    <Box ml={2}></Box>
  </Flex>;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data }
      emptyText="There are no transactions."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find any contract that matches your query.`,
        hasActiveFilters: Boolean(filterChain || type || data?.length <= 0),
      }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TxsContent;
