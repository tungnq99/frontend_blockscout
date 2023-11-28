import { Hide, Show, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { TokenType } from 'types/api/token';

import { SECOND } from 'lib/consts';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import { apos } from 'lib/html-entities';
import TOKEN_TYPE from 'lib/token/tokenTypes';
import { getTokenTransfersStub } from 'stubs/token';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';
import axios from 'axios';
import { setApiChain } from 'playwright/utils/utilString';
import useFetchCallApi from '../../playwright/utils/useFetchCallApi';

const TOKEN_TYPES = TOKEN_TYPE.map(i => i.id);

const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPES);

const TxTokenTransfer = () => {
  const txsInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const router = useRouter();
  const [ typeFilter, setTypeFilter ] = React.useState<Array<TokenType>>(getTokenFilterValue(router.query.type) || []);
  
  const { dataResult, isError, isPlaceholderData, error, pagination, callback } = useFetchCallApi(`${setApiChain(router)}/token-transfers?type=${typeFilter}`, setApiChain(router));

  useEffect(() => {
    callback();
  }, [typeFilter])

  if (error) {
    return <DataFetchAlert />
  }

  if (!txsInfo.isLoading && !txsInfo.isPlaceholderData && !txsInfo.isError && !txsInfo.data.status) {
    return txsInfo.socketStatus ? <TxSocketAlert status={ txsInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  if (!txsInfo?.data) {
    return <Text as="span">There are no token transfers.</Text>;
  }

  //const queryTokenTransfer = tokenTransferFetch();
 

  const numActiveFilters = typeFilter.length;
  const isActionBarHidden = !numActiveFilters && !dataResult?.items?.length;

  const content = dataResult?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <TokenTransferTable data={ dataResult?.items } top={ isActionBarHidden ? 0 : 80 } isLoading={ isPlaceholderData }/>
      </Hide>
      <Show below="lg" ssr={ false }>
        <TokenTransferList data={ dataResult?.items } isLoading={ isPlaceholderData }/>
      </Show>
    </>
  ) : null;

  const handleTypeFilterChange = ((nextValue: Array<TokenType>) => {
    setTypeFilter(nextValue);
  });

  const actionBar = !isActionBarHidden ? (
    <ActionBar mt={ -6 }>
      <TokenTransferFilter
        defaultTypeFilters={ typeFilter }
        onTypeFilterChange={ handleTypeFilterChange }
        appliedFiltersNum={ numActiveFilters }
        isLoading={ isPlaceholderData }
      />
      {/* <Pagination ml="auto" { ...pagination?. }/> */}
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ txsInfo.isError || isError }
      items={ dataResult?.items }
      emptyText="There are no token transfers."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find any token transfer that matches your query.`,
        hasActiveFilters: Boolean(numActiveFilters || dataResult?.items?.length === 0),
      }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TxTokenTransfer;
