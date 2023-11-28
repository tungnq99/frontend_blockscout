import axios from 'axios';
import useToast from 'lib/hooks/useToast';
import React, { useEffect } from 'react';

export default function useFetchCallApi(api: any, isDisabled: any) {
  const toast = useToast();
  const [ dataResult, setData ] = React.useState<any>();
  const [ isError, setIsError ] = React.useState<boolean>(false);
  const [ isPlaceholderData, setIsPlaceholderData ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<any>();
  const [ pagination, setPagination ] = React.useState<any>();
  
  const getMyData = async () => {
    if (isDisabled !== undefined) {
      try {
        const res: any = await axios.get(api);
        if (res.status !== 200) {
          setIsError(true);
          return;
        }
        setData(res?.data);
        setPagination(res?.data)
        setIsPlaceholderData(res.status !== 200);
      } catch (error: any) {
        setError(error)
        toast({
          position: 'top-right',
          title: 'Error',
          description: error?.message || 'Something went wrong',
          status: 'error',
          variant: 'subtle',
          isClosable: true,
        });
      }}
  }

  const callback: any = () => {
    getMyData();
  }

  useEffect(() => {
      getMyData()
  }, [])

  return {
    dataResult,
    isError,
    isPlaceholderData,
    error,
    pagination,
    callback
  };
}
