import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import { SECOND } from 'lib/consts';
import { LOG } from 'stubs/log';
import { generateListStub } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import LogItem from 'ui/shared/logs/LogItem';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import { setApiChain } from 'playwright/utils/utilString';
import useFetchCallApi from '../../playwright/utils/useFetchCallApi';
import { useRouter } from 'next/router';

const TxLogs = () => {
  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const router = useRouter();
  const { dataResult, isError, isPlaceholderData, error, pagination, callback } = useFetchCallApi(`${setApiChain(router)}/logs`, setApiChain(router));
  // const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
  //   resourceName: 'tx_logs',
  //   pathParams: { hash: txInfo.data?.hash },
  //   options: {
  //     enabled: !txInfo.isPlaceholderData && Boolean(txInfo.data?.hash) && Boolean(txInfo.data?.status),
  //     placeholderData: generateListStub<'tx_logs'>(LOG, 3, { next_page_params: null }),
  //   },
  // });

  if (!txInfo.isLoading && !txInfo.isPlaceholderData && !txInfo.isError && !txInfo.data.status) {
    return txInfo.socketStatus ? <TxSocketAlert status={ txInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  if (isError || txInfo.isError) {
    return <DataFetchAlert/>;
  }

  if (!dataResult?.items?.length || !txInfo?.data) {
    return <Text as="span">There are no logs for this transaction.</Text>;
  }

  return (
    <Box>
      { pagination?.isVisible && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      { dataResult?.items.map((item: any, index: number) => <LogItem key={ index } { ...item } type="transaction" isLoading={ isPlaceholderData }/>) }
    </Box>
  );
};

export default TxLogs;
