import { Hide, Show } from '@chakra-ui/react';
import useMultiAPI from 'playwright/utils/useMultiApi';
import React from 'react';

import { TOP_ADDRESS } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import AddressesListItem from 'ui/addresses/AddressesListItem';
import AddressesTable from 'ui/addresses/AddressesTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const PAGE_SIZE = 50;

const Accounts = () => {
  // const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
  //   resourceName: 'addresses',
  //   options: {
  //     placeholderData: generateListStub<'addresses'>(
  //       TOP_ADDRESS,
  //       50,
  //       {
  //         next_page_params: {
  //           fetched_coin_balance: '42',
  //           hash: '0x99f0ec06548b086e46cb0019c78d0b9b9f36cd53',
  //           items_count: 50,
  //         },
  //         total_supply: '0',
  //       },
  //     ),
  //   },
  // });

  const { isError, isPlaceholderData, data, pagination } = useMultiAPI("addresses", true); 
  
  const actionBar = pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const pageStartIndex = (pagination.page - 1) * PAGE_SIZE + 1;
  const content = data ? (
    <>
      <Hide below="lg" ssr={ false }>
        <AddressesTable
          top={ pagination.isVisible ? 80 : 0 }
          items={ data }
          totalSupply={ data.total_supply }
          pageStartIndex={ pageStartIndex }
          isLoading={ isPlaceholderData }
        />
      </Hide>
      <Show below="lg" ssr={ false }>
        { data.map((item: any, index: any) => {
          return (
            <AddressesListItem
              key={ item.hash + (isPlaceholderData ? index : '') }
              item={ item }
              index={ index }
              totalSupply={ data.total_supply }
              isLoading={ isPlaceholderData }
            />
          );
        }) }
      </Show>
    </>
  ) : null;

  return (
    <>
      <PageTitle title="Address" withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data }
        emptyText="There are no accounts."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default Accounts;
