import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import LogItem from 'ui/shared/logs/LogItem';
import Pagination from 'ui/shared/pagination/Pagination';

import AddressCsvExportLink from './AddressCsvExportLink';
import useMultiAPI from 'playwright/utils/useMultiApi';
import { apos } from 'lib/html-entities';

const AddressLogs = ({ scrollRef }: {scrollRef?: React.RefObject<HTMLDivElement>}) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const { data, isPlaceholderData, isError, pagination, callback }  = useMultiAPI(`addresses/${hash}/logs`);
  // const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
  //   resourceName: 'address_logs',
  //   pathParams: { hash },
  //   scrollRef,
  //   options: {
  //     placeholderData: generateListStub<'address_logs'>(LOG, 3, { next_page_params: {
  //       block_number: 9005750,
  //       index: 42,
  //       items_count: 50,
  //       transaction_index: 23,
  //     } }),
  //   },
  // });

  const actionBar = (
    <ActionBar mt={ -6 } showShadow justifyContent={{ base: 'space-between', lg: 'end' }}>
      <AddressCsvExportLink
        address={ hash }
        isLoading={ pagination.isLoading }
        params={{ type: 'logs' }}
      />
      <Pagination ml={{ base: 0, lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  const content = data ? data.map((item: any, index: number) => <LogItem key={ index } { ...item } type="address" isLoading={ isPlaceholderData }/>) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no logs for this address."
      filterProps={{ emptyFilteredText: `Couldn${ apos }t find any transaction that matches your query.`, hasActiveFilters: Boolean(data?.length <= 0) }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default AddressLogs;
