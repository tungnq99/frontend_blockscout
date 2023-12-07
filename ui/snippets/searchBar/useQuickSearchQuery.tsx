import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';
import axios from 'axios';
import { APIS } from 'lib/api/apis';
import useToast from 'lib/hooks/useToast';

export default function useQuickSearchQuery() {
  const router = useRouter();
  const toast = useToast();
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const [query, setQuery] = React.useState<any>();
  const [redirectCheckQuery, setRedirectCheck] = React.useState<any>();
  const [ pagination, setPagination ] = React.useState<any>(10);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const pathname = router.pathname;

  const getMyData = async (hash: any,q?: any) => {
    try {
      let data: any;
      let isError = false;
      let isPlaceholderData = true;
      const promises = APIS.map((url: any, index: number) => axios.get(`${url}/search-quick?q=${q}`));

      const responses = (await Promise.allSettled(promises)).filter(res => res.status === 'fulfilled');
      const getData = responses.map((response: any, idx) => {
        const res = response?.value;
        isError = res?.status !== 200;
        if (res?.status !== 200) {
          toast({
            position: 'top-right',
            title: 'Error',
            description: res?.reason?.message || 'Something went wrong',
            status: 'error',
            variant: 'subtle',
            isClosable: true,
          });
          return {
            data,
            isError,
            isPlaceholderData,
            pagination
          };
        }
      
        const results = res?.data?.items?.length >= 0 ?  res?.data?.items : res?.data;
        return results;
      });

      const flatArr = getData.flat();
      data = removeDuplicateArr(flatArr);
  
      isPlaceholderData = false;
      return {
        data,
        isError,
        isPlaceholderData,
        pagination
      }
    } catch (error: any) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }

  
  function removeDuplicateArr(array: any) {
    const uniqueObjectsMap = new Map();

    // Iterate through the array and add each object to the Map
    for (const obj of array) {
        uniqueObjectsMap.set(obj.hash, obj);
    }

    // Convert the Map back to an array
    return Array.from(uniqueObjectsMap.values());
  }

  if (debouncedSearchTerm.trim().length > 0) {
      setQuery(getMyData("search/quick",debouncedSearchTerm));
  }

  if (Boolean(debouncedSearchTerm)) {
    setRedirectCheck(getMyData("search/check-redirect",debouncedSearchTerm));
}

  // const query = useApiQuery('quick_search', {
  //   queryParams: { q: debouncedSearchTerm },
  //   queryOptions: { enabled: debouncedSearchTerm.trim().length > 0 },
  // });
  
  
  // const redirectCheckQuery = useApiQuery('search_check_redirect', {
  //   // on pages with regular search bar we check redirect on every search term change
  //   // in order to prepend its result to suggest list since this resource is much faster than regular search
  //   queryParams: { q: debouncedSearchTerm },
  //   queryOptions: { enabled: Boolean(debouncedSearchTerm) },
  // });

  return React.useMemo(() => ({
    searchTerm,
    debouncedSearchTerm,
    handleSearchTermChange: setSearchTerm,
    query,
    redirectCheckQuery,
    pathname,
  }), [ debouncedSearchTerm, pathname, query, redirectCheckQuery, searchTerm ]);
}
