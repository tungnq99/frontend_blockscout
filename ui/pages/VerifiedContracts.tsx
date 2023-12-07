import { Box, Hide, HStack, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { VerifiedContractsFilters } from 'types/api/contracts';

import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import { VERIFIED_CONTRACT_INFO } from 'stubs/contract';
import { generateListStub } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import FilterInput from 'ui/shared/filters/FilterInput';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import Sort from 'ui/shared/sort/Sort';
import type { SortField, Sort as TSort } from 'ui/verifiedContracts/utils';
import { SORT_OPTIONS, sortFn, getNextSortValue } from 'ui/verifiedContracts/utils';
import VerifiedContractsCounters from 'ui/verifiedContracts/VerifiedContractsCounters';
import VerifiedContractsFilter from 'ui/verifiedContracts/VerifiedContractsFilter';
import VerifiedContractsList from 'ui/verifiedContracts/VerifiedContractsList';
import VerifiedContractsTable from 'ui/verifiedContracts/VerifiedContractsTable';
import useMultiAPI from 'playwright/utils/useMultiApi';


const VerifiedContracts = () => {
  const router = useRouter();
  const [ searchTerm, setSearchTerm ] = React.useState(getQueryParamString(router.query.q) || undefined);
  const [ type, setType ] = React.useState(getQueryParamString(router.query.filter) as VerifiedContractsFilters['filter'] || undefined);
  const [ sort, setSort ] = React.useState<TSort>();

  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  const isMobile = useIsMobile();

  const { data, isError, isPlaceholderData, pagination, callback } = useMultiAPI("smart-contracts", true);
  // const { isError, isPlaceholderData, data, pagination, onFilterChange } = useQueryWithPages({
  //   resourceName: 'verified_contracts',
  //   filters: { q: debouncedSearchTerm, filter: type },
  //   options: {
  //     placeholderData: generateListStub<'verified_contracts'>(
  //       VERIFIED_CONTRACT_INFO,
  //       50,
  //       {
  //         next_page_params: {
  //           items_count: '50',
  //           smart_contract_id: '50',
  //         },
  //       },
  //     ),
  //   },
  // });

  // useEffect(() => {
  //   //callback(searchTerm, type);
  //   console.log(type)
  // }, [searchTerm, type])


  const handleSearchTermChange = React.useCallback((value: string) => {
    callback("contract", value, type);
    setSearchTerm(value);
  }, [ type ]);

  const handleTypeChange = React.useCallback((value: string | Array<string>) => {
    if (Array.isArray(value)) {
      return;
    }

    const filter = value === 'all' ? undefined : value as VerifiedContractsFilters['filter'];
    callback("contract", debouncedSearchTerm, filter);
    setType(filter);
  }, [ debouncedSearchTerm ]);

  const handleSortToggle = React.useCallback((field: SortField) => {
    return () => {
      setSort(getNextSortValue(field));
    };
  }, []);
  
  const typeFilter = <VerifiedContractsFilter onChange={ handleTypeChange } defaultValue={ type } isActive={ Boolean(type) }/>;

  const filterInput = (
    <FilterInput
      w={{ base: '100%', lg: '350px' }}
      size="xs"
      onChange={ handleSearchTermChange }
      placeholder="Search by contract name or address"
      initialValue={ searchTerm }
    />
  );

  const sortButton = (
    <Sort
      options={ SORT_OPTIONS }
      sort={ sort }
      setSort={ setSort }
    />
  );

  const totalCount = ( <VerifiedContractsCounters />)

  const actionBar = (
    <>
      <HStack spacing={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { typeFilter }
        { sortButton }
        { filterInput }
      </HStack>
      { (!isMobile || pagination?.isVisible) && (
        <ActionBar mt={ -6 }>
          <HStack spacing={ 3 } display={{ base: 'none', lg: 'flex' }}>
            { typeFilter }
            { sortButton }
            { filterInput }
          </HStack>
          <HStack>
          { totalCount }
          <Pagination ml="auto" { ...pagination }/>
          </HStack>
         
        </ActionBar>
      ) }
    </>
  );
  
  const content = data ? (
    <>
      <Show below="lg" ssr={ false }>
        <VerifiedContractsList data={ data } isLoading={ isPlaceholderData }/>
      </Show>
      <Hide below="lg" ssr={ false }>
        <VerifiedContractsTable data={ data } sort={ sort } onSortToggle={ handleSortToggle } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  return (
    <Box>
      <PageTitle title="Verified contracts" withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data }
        emptyText="There are no verified contracts."
        filterProps={{
          emptyFilteredText: `Couldn${ apos }t find any contract that matches your query.`,
          hasActiveFilters: Boolean(searchTerm || type),
        }}
        content={ content }
        actionBar={ actionBar }
      />
    </Box>
  );
};

export default VerifiedContracts;
