import { Grid } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import NFTItem from './NFTItem';
import { apos } from 'lib/html-entities';

type Props = {
  tokensQuery: any;
}

const ERC1155Tokens = ({ tokensQuery }: Props) => {
  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination } = tokensQuery;

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data ? (
    <Grid
      w="100%"
      columnGap={{ base: 3, lg: 6 }}
      rowGap={{ base: 3, lg: 6 }}
      gridTemplateColumns={{ base: 'repeat(2, calc((100% - 12px)/2))', lg: 'repeat(auto-fill, minmax(210px, 1fr))' }}
    >
      { data.map((item: any, index: number) => {
        const key = item.token.address + '_' + (item.token_instance?.id && !isPlaceholderData ? `id_${ item.token_instance?.id }` : `index_${ index }`);

        return (
          <NFTItem
            key={ key }
            { ...item }
            isLoading={ isPlaceholderData }
          />
        );
      }) }
    </Grid>
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

export default ERC1155Tokens;
