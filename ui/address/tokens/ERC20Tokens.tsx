import { Show, Hide } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import ERC20TokensListItem from './ERC20TokensListItem';
import ERC20TokensTable from './ERC20TokensTable';
import { apos } from 'lib/html-entities';

type Props = {
  tokensQuery: any;
}

const ERC20Tokens = ({ tokensQuery }: Props) => {
  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination } = tokensQuery;

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data ? (
    <>
      <Hide below="lg" ssr={ false }><ERC20TokensTable data={ data } top={ pagination.isVisible ? 72 : 0 } isLoading={ isPlaceholderData }/></Hide>
      <Show below="lg" ssr={ false }>{ data.map((item: any, index: number) => (
        <ERC20TokensListItem
          key={ item.token.address + (isPlaceholderData ? index : '') }
          { ...item }
          isLoading={ isPlaceholderData }
        />
      )) }</Show></>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data }
      emptyText="There are no tokens of selected type."
      filterProps={{ emptyFilteredText: `Couldn${ apos }t find any transaction that matches your query.`, hasActiveFilters: Boolean(data?.length <= 0) }}
      content={ content }
      actionBar={ actionBar }
    />
  );

};

export default ERC20Tokens;
