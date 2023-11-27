import React, { useEffect } from 'react';
const axios = require('axios');
import { APIS } from 'lib/api/apis';
import useToast from 'lib/hooks/useToast';

export default function useTxsSortAPI(query: string) {
  const toast = useToast();
  const [ dataResult, setData ] = React.useState<any>();

  const getMyData = async (query: string) => {
    try {
      const promises = APIS.map((url) => axios.get(`${url}?filter=${query}`));
   
      const responses = await Promise.all(promises);
      console.log(responses);
      
      const getData = responses.map(res => {
        if (res.status !== 200) {
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
    callback
  };

}
