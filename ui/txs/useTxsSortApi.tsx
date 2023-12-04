import React, { useEffect } from 'react';
const axios = require('axios');
import { APIS } from 'lib/api/apis';
import useToast from 'lib/hooks/useToast';

export default function useTxsSortAPI(query: string) {
  const toast = useToast();
  const [ data, setData ] = React.useState<any>([]);
  const [ isError, setIsError ] = React.useState<boolean>(false);
  const [ isPlaceholderData, setIsPlaceholderData ] = React.useState<boolean>(true);
  const [ pagination, setPagination ] = React.useState<any>(50);

  const getMyData = async (query: string) => {
    try {
      const promises = APIS.map((url) => axios.get(`${url}/transactions?filter=${query}`));
   
      const responses = (await Promise.allSettled(promises)).filter(res => res.status === 'fulfilled');
      
      const getData = responses.map((response: any ) => {
        const res = response?.value;
        if (res.status !== 200) {
          setIsError(true)
          toast({
            position: 'top-right',
            title: 'Error',
            description: res?.message || 'Something went wrong',
            status: 'error',
            variant: 'subtle',
            isClosable: true,
          });
          return [];
        }
       
        return res?.data?.items;
      });
     
      const flatArr = getData.flat();
      setData(flatArr.sort((x: any, y: any) => Date.parse(y.timestamp) -  Date.parse(x.timestamp)));
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

  const callback: any = React.useCallback(() => {
    getMyData(query);
  }, [query])

  useEffect(() => {
    getMyData(query);
  }, [])

  return {
    data,
    isPlaceholderData,
    isError,
    pagination,
    callback
  };

}
