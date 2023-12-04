import { Accordion, Hide, Show, Text } from '@chakra-ui/react';
import React from 'react';

import { SECOND } from 'lib/consts';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import TxStateList from 'ui/tx/state/TxStateList';
import TxStateTable from 'ui/tx/state/TxStateTable';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

import TxPendingAlert from './TxPendingAlert';
import TxSocketAlert from './TxSocketAlert';

import useFetchCallApi from '../../playwright/utils/useFetchCallApi';
import { setApiChain } from 'playwright/utils/utilString';
import { useRouter } from 'next/router';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

const TxState = () => {
  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const router = useRouter();
  const { dataResult, isError, isPlaceholderData, error, pagination, callback } = useFetchCallApi(`${setApiChain(router)}/state-changes`, setApiChain(router));
  // const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
  //   resourceName: 'tx_state_changes',
  //   pathParams: { hash: txInfo.data?.hash },
  //   options: {
  //     enabled: !txInfo.isPlaceholderData && Boolean(txInfo.data?.hash) && Boolean(txInfo.data?.status),
  //     placeholderData: {
  //       items: TX_STATE_CHANGES,
  //       next_page_params: {
  //         items_count: 1,
  //         state_changes: null,
  //       },
  //     },
  //   },
  // });

  if (!txInfo.isLoading && !txInfo.isPlaceholderData && !txInfo.isError && !txInfo.data.status) {
    return txInfo.socketStatus ? <TxSocketAlert status={ txInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  if (error ) {
    return <DataFetchAlert />
  }

  if (!txInfo?.data) {
    return <Text as="span">There are no state changes for this transaction.</Text>;
  }

  const content = dataResult ? (
    <Accordion allowMultiple defaultIndex={ [] }>
      <Hide below="lg" ssr={ false }>
        <TxStateTable data={ dataResult.items } isLoading={ isPlaceholderData } top={ pagination?.isVisible ? 80 : 0 }/>
      </Hide>
      <Show below="lg" ssr={ false }>
        <TxStateList data={ dataResult.items } isLoading={ isPlaceholderData }/>
      </Show>
    </Accordion>
  ) : null;

  const actionBar = pagination?.isVisible ? (
    <ActionBar mt={ -6 } showShadow>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <>
      <DataListDisplay
        isError={ isError }
        items={ dataResult?.items }
        emptyText="There are no state changes for this transaction."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default TxState;
