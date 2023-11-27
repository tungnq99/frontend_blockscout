import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Transaction } from 'types/api/transaction';

import type { ResourceError } from 'lib/api/resources';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import delay from 'lib/delay';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { TX } from 'stubs/tx';
import { APIS_KEY } from 'lib/api/apis';
import axios from 'axios';
import useToast from 'lib/hooks/useToast';

interface Params {
  onTxStatusUpdate?: () => void;
  updateDelay?: number;
}

type ReturnType = UseQueryResult<Transaction, ResourceError<{ status: number }>> & {
  socketStatus: 'close' | 'error' | undefined;
}

export default function useFetchTxInfo({ onTxStatusUpdate, updateDelay }: Params | undefined = {}): ReturnType {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [ socketStatus, setSocketStatus ] = React.useState<'close' | 'error'>();
  const [ data, setData ] = React.useState();
  const [ status, setStatus ] = React.useState<Number>();
  const [ isError, setIsError ] = React.useState<boolean>(false);
  const [ error, setError ] = React.useState<any>(null);
  const [ isPlaceholderData, setIsPlaceholderData ] = React.useState<boolean>(true);

  const hash = getQueryParamString(router.query.hash);
  const key = hash.substring(2,6);

  const queryTxChain = async () => {
    try {
      if (APIS_KEY[key] === undefined) {
        return;
      }

      const res: any = await axios.get(APIS_KEY[key] + hash);
      setIsPlaceholderData(true);
     
      if (res.status !== 200) {
        setError(res)
        toast({
          position: 'top-right',
          title: 'Error',
          description: res?.message || 'Something went wrong',
          status: 'error',
          variant: 'subtle',
          isClosable: true,
        });
        setIsError(true);
        return;
      }
      setStatus(res.status);
      setIsPlaceholderData(false);
      setData(res.data);
    } catch (error) {
        if (error) setIsError(true);
        setError(error)
        setIsPlaceholderData(false);
    }
  }

  useEffect(() => {
    queryTxChain();
    console.log(1);
    
  }, [])
  
  const queryResult: any = {data, isPlaceholderData, isError, error}

  // const queryResult = useApiQuery<'tx', { status: number }>('tx', {
  //   pathParams: { hash },
  //   queryOptions: {
  //     enabled: Boolean(hash),
  //     refetchOnMount: false,
  //     placeholderData: TX,
  //   },
  // });

  // const { isLoading } = queryResult;
  
  

  const handleStatusUpdateMessage: SocketMessage.TxStatusUpdate['handler'] = React.useCallback(async() => {
    updateDelay && await delay(updateDelay);
    queryClient.invalidateQueries({
      queryKey: getResourceKey('tx', { pathParams: { hash } }),
    });
    onTxStatusUpdate?.();
  }, [ onTxStatusUpdate, queryClient, hash, updateDelay ]);

  const handleSocketClose = React.useCallback(() => {
    setSocketStatus('close');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketStatus('error');
  }, []);

  const channel = useSocketChannel({
    topic: `transactions:${ hash }`,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled:  isPlaceholderData || isError || status !== null,
  });
  useSocketMessage({
    channel,
    event: 'collated',
    handler: handleStatusUpdateMessage,
  });

  return {
    ...queryResult,
    socketStatus,
  };
}
