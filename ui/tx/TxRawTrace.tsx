import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { RawTracesResponse } from 'types/api/rawTrace';

import useApiQuery from 'lib/api/useApiQuery';
import { SECOND } from 'lib/consts';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { TX_RAW_TRACE } from 'stubs/tx';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import RawDataSnippet from 'ui/shared/RawDataSnippet';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import { Text } from '@chakra-ui/react';
import { setApiChain } from 'playwright/utils/utilString';
import useFetchCallApi from '../../playwright/utils/useFetchCallApi';

const TxRawTrace = () => {
  const [ isQueryEnabled, setIsQueryEnabled ] = React.useState(false);
  const [ rawTraces, setRawTraces ] = React.useState<RawTracesResponse>();
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const { dataResult, isError, isPlaceholderData, error, pagination, callback } = useFetchCallApi(`${setApiChain(router)}/raw-trace`, setApiChain(router));
  // const { data, isPlaceholderData, isError } = useApiQuery('tx_raw_trace', {
  //   pathParams: { hash },
  //   queryOptions: {
  //     enabled: Boolean(hash) && Boolean(txInfo.data?.status) && isQueryEnabled,
  //     placeholderData: TX_RAW_TRACE,
  //   },
  // });

  // const handleRawTraceMessage: SocketMessage.TxRawTrace['handler'] = React.useCallback((payload) => {
  //   setRawTraces(payload);
  // }, [ ]);

  // const enableQuery = React.useCallback(() => setIsQueryEnabled(true), []);

  // const channel = useSocketChannel({
  //   topic: `transactions:${ hash }`,
  //   isDisabled: !hash || txInfo.isPlaceholderData || !txInfo.data?.status,
  //   onJoin: enableQuery,
  //   onSocketError: enableQuery,
  // });
  // useSocketMessage({
  //   channel,
  //   event: 'raw_trace',
  //   handler: handleRawTraceMessage,
  // });

  if (!txInfo.isLoading && !txInfo.isPlaceholderData && !txInfo.isError && !txInfo.data.status) {
    return txInfo.socketStatus ? <TxSocketAlert status={ txInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  if (isError || txInfo.isError) {
    return <DataFetchAlert/>;
  }

  if (!txInfo?.data) {
    return <Text as="span">No trace entries found.</Text>;
  }

  const dataToDisplay = rawTraces ? rawTraces : dataResult;

  if (!isPlaceholderData && dataToDisplay?.length === 0) {
    return <span>No trace entries found.</span>;
  }

  const text = JSON.stringify(dataToDisplay, undefined, 4);

  return <RawDataSnippet data={ text } isLoading={ isPlaceholderData }/>;
};

export default TxRawTrace;
