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

  const getMyData = async (q?: any, filter?: any) => {
    try {
      const query = q !== undefined || filter !== undefined ? `?q=${q}&filter=${filter}` : '';
      const promises = APIS.map((url) => axios.get(`${url}/${hash}${query}`));
   
      const responses = await Promise.all(promises);
      
      const getData = responses.map(res => {
        if (res.status !== 200) {
          setIsError(true);
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
       
        return res?.data;
      });

      const result = getData[0]?.items?.length >= 0 ? getData[0]?.items : getData[0]?.length >= 0 ? getData[0] : getData;
      setData(result.sort((x: any, y: any) => Date.parse(y.timestamp) -  Date.parse(x.timestamp)));
      
      setIsPlaceholderData(result?.length === 0);
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

  const callback: any = (q: any, filter: any) => {
    getMyData(q, filter);
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
