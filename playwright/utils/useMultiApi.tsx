import React, { useEffect } from 'react';
const axios = require('axios');
import { APIS } from 'lib/api/apis';
import useToast from 'lib/hooks/useToast';

export default function useMultiAPI(hash: string) {
  const toast = useToast();
  const [ data, setData ] = React.useState<any>();
  const [ isError, setIsError ] = React.useState<boolean>(false);
  const [ isPlaceholderData, setIsPlaceholderData ] = React.useState<boolean>(true);
  const [ pagination, setPagination ] = React.useState<any>(10);

  const getMyData = async (text_page?: any, q?: any, filter?: any, ) => {
    try {
      const query = text_page === 'contract' ? `?q=${q}&filter=${filter}` : 
                    text_page === 'token_transfer' ? `?type=${q}&filter=${filter === 'all' ? '' : filter}` : 
                    text_page === 'tokens' ? `?type=${q}` : 
                    text_page === 'internal' ? `?filter=${q}` : '';
      const promises = APIS.map((url: any, index: number) => axios.get(`${url}/${hash}${query}`));

      const responses = (await Promise.allSettled(promises)).filter(res => res.status === 'fulfilled');
      const getData = responses.map((response: any, idx) => {
        const res = response?.value;
        if (res?.status !== 200) {
          setIsError(true);
          toast({
            position: 'top-right',
            title: 'Error',
            description: res?.reason?.message || 'Something went wrong',
            status: 'error',
            variant: 'subtle',
            isClosable: true,
          });
          return [];
        }
       
        
        const results = res?.data?.items?.length >= 0 ?  res?.data?.items : res?.data;
        return results;
      });

      const flatArr = getData.flat();
      const result =  hash === "addresses" ? removeDuplicateArr(flatArr) : flatArr;
      setData(result.sort((x: any, y: any) => Date.parse(y.timestamp) -  Date.parse(x.timestamp)));
      
      setIsPlaceholderData(false);
    } catch (error: any) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: error?.message || 'Something went wrong',
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

  const callback: any = (text_page?: any, q?: any, filter?: any) => {
    getMyData(text_page, q, filter);
  }

  useEffect(() => {
    getMyData();
  }, [])

  return {
    data,
    isPlaceholderData, 
    isError,
    pagination,
    callback
  };

}
