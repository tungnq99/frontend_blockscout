import { Box, Show, Hide } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import type { AddressFromToFilter } from 'types/api/address';
import { apos } from 'lib/html-entities';
import useIsMobile from 'lib/hooks/useIsMobile';
import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import TxsHeaderMobile from './TxsHeaderMobile';
import TxsListItem from './TxsListItem';
import TxsTable from './TxsTable';
import useTxsSort from './useTxsSort';
import FilterInput from 'ui/shared/filters/FilterInput';
import getQueryParamString from 'lib/router/getQueryParamString';
import dataTransaction from './txs.json';
import { Transaction } from 'types/api/transaction';

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
  const [dataTxs, setDataTxs] = useState(dataTransaction.items);
  const { data, isPlaceholderData, isError, setSortByField, setSortByValue, sorting } = useTxsSort(query);
  const [ searchTerm, setSearchTerm ] = React.useState(getQueryParamString(router.query.q) || undefined);
  const [ type, setType ] = React.useState(getQueryParamString(router.query.filter) || undefined);
  
  const isMobile = useIsMobile();

  const content = dataTxs ? (
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
          { dataTxs.map((tx, index) => (
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
          txs={ dataTxs }
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

  const onFilterChange = (value: string) => {
    if (value == "") {
      setDataTxs(dataTransaction.items)
      return true;
    };
    setDataTxs(dataTxs.filter(item => item?.hash.includes(value)));
  }

  const handleSearchTermChange = React.useCallback((value: string) => {
    onFilterChange(value);
    setSearchTerm(value);
  }, [ type, onFilterChange ]);

  const actionBar = isMobile ? (
    <TxsHeaderMobile
      mt={ -6 }
      sorting={ sorting }
      setSorting={ setSortByValue }
      paginationProps={ query.pagination }
      showPagination={ query.pagination.isVisible }
      filterComponent={ filter }
      linkSlot={ currentAddress ? (
        <AddressCsvExportLink
          address={ currentAddress }
          params={{ type: 'transactions', filterType: 'address', filterValue }}
          isLoading={ query.pagination.isLoading }
        />
      ) : null
      }
    />
  ) : <FilterInput
    w={{ base: '100%', lg: '250px' }}
    mb={'15px'}
    size="xs"
    onChange={ handleSearchTermChange }
    placeholder="Search by txn hash"
    initialValue={ searchTerm }
  />;

  return (
    <DataListDisplay
      isError={ isError }
      items={ dataTxs }
      emptyText="There are no transactions."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find any contract that matches your query.`,
        hasActiveFilters: Boolean(searchTerm || type),
      }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TxsContent;
