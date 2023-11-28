import React, { useEffect } from 'react';
const axios = require('axios');
import { APIS } from 'lib/api/apis';
import useToast from 'lib/hooks/useToast';

export default function useTxsSortAPI(query: string) {
  const toast = useToast();
  const [ dataResult, setData ] = React.useState<any>();
  const [ isError, setIsError ] = React.useState<boolean>(false);
  const [ isPlaceholderData, setIsPlaceholderData ] = React.useState<boolean>(true);

  const getMyData = async (query: string) => {
    try {
      const promises = APIS.map((url) => axios.get(`${url}/transactions?filter=${query}`));
   
      const responses = await Promise.all(promises);
      
      const getData = responses.map(res => {
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
      
      setData(getData[0].sort((x: any, y: any) => Date.parse(y.timestamp) -  Date.parse(x.timestamp)));
      setTimeout(() => {
        setIsPlaceholderData(false);
      }, 1000);
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

  const callback: any = () => {
    getMyData(query);
  }

  useEffect(() => {
    getMyData(query);
  }, [])

  React.useCallback(() => () => {
    getMyData(query);
  }, [ query ]);


  return {
    dataResult,
    isPlaceholderData,
    isError,
    callback
  };

}
