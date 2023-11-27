import { Box, Show, Hide, Flex } from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';

import type { AddressFromToFilter } from 'types/api/address';
import { apos } from 'lib/html-entities';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import TxsListItem from './TxsListItem';
import TxsTable from './TxsTable';
import useTxsSort from './useTxsSort';
import getQueryParamString from 'lib/router/getQueryParamString';
import useTxsSortAPI from './useTxsSortApi';
import TxsFiltersChain from './TxsFiltersChain';
import TxsFilters from './TxsFilters';
import { TTxsFilters, TypeFilter } from 'types/api/txsFilters';

type Props = {
  query: QueryWithPagesResult<'txs_validated' | 'txs_pending'> | QueryWithPagesResult<'txs_watchlist'> | QueryWithPagesResult<'block_txs'>;
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
  
  const { data, isPlaceholderData, isError, setSortByField, setSortByValue, sorting } = useTxsSort(query);
  const [ filterChain, setFilterChain ] = React.useState(0);
  const {dataResult, callback } = useTxsSortAPI(params.get("tab"));
  const [ type, setType ] = React.useState(getQueryParamString(router.query.filter) || undefined);
  const [filteArr, setFilterArr] = React.useState<Partial<TTxsFilters>>();

  const content = dataResult ? (
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
          { dataResult.map((tx: any, index: number) => (
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
          txs={ dataResult }
          sort={ setSortByField }
          sorting={ sorting }
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

  const handleFilterChain = React.useCallback((value: Partial<TTxsFilters>) => {
    console.log(value);
    
  }, []);

 

  const actionBar = <Flex mb={2}>
    <Box ml={2}> <TxsFilters filters={filteArr} appliedFiltersNum={1} onFiltersChange={handleFilterChain} /></Box>
  </Flex>;

  return (
    <DataListDisplay
      isError={ isError }
      items={ dataResult }
      emptyText="There are no transactions."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find any contract that matches your query.`,
        hasActiveFilters: Boolean(filterChain || type),
      }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TxsContent;
