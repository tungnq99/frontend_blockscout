import { Box, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import iconSuccess from 'icons/status/success.svg';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useContractTabs from 'lib/hooks/useContractTabs';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS_INFO, ADDRESS_TABS_COUNTERS } from 'stubs/address';
import AddressBlocksValidated from 'ui/address/AddressBlocksValidated';
import AddressCoinBalance from 'ui/address/AddressCoinBalance';
import AddressContract from 'ui/address/AddressContract';
import AddressDetails from 'ui/address/AddressDetails';
import AddressInternalTxs from 'ui/address/AddressInternalTxs';
import AddressLogs from 'ui/address/AddressLogs';
import AddressTokens from 'ui/address/AddressTokens';
import AddressTokenTransfers from 'ui/address/AddressTokenTransfers';
import AddressTxs from 'ui/address/AddressTxs';
import AddressWithdrawals from 'ui/address/AddressWithdrawals';
import TextAd from 'ui/shared/ad/TextAd';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import { APIS } from 'lib/api/apis';
import useFetchCallApi from 'playwright/utils/useFetchCallApi';
import useMultiAPI from 'playwright/utils/useMultiApi';

export const tokenTabsByType: Record<TokenType, string> = {
  'ERC-20': 'tokens_erc20',
  'ERC-721': 'tokens_erc721',
  'ERC-1155': 'tokens_erc1155',
} as const;

const TOKEN_TABS = Object.values(tokenTabsByType);
let _addressQuery: any;
const AddressPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const appProps = useAppContext();

  const tabsScrollRef = React.useRef<HTMLDivElement>(null);
  const hash = getQueryParamString(router.query.hash);
  const {data, isError, isPlaceholderData, pagination, callback} = useMultiAPI(`addresses/${hash}`, true)
  if (data?.length == 2 && data[0]?.is_contract) _addressQuery = { dataResult: data[0], isError, isPlaceholderData, pagination };

  const addressQuery = useFetchCallApi(`${APIS[0]}/addresses/${hash}`, null)
  //const addressTabsCountersQuery = useFetchCallApi(`${APIS[0]}/addresses/${hash}/tabs-counters`, null)
  // const addressQuery = useApiQuery('address', {
  //   pathParams: { hash },
  //   queryOptions: {
  //     enabled: Boolean(hash),
  //     placeholderData: ADDRESS_INFO,
  //   },
  // });

  // const addressTabsCountersQuery = useApiQuery('address_tabs_counters', {
  //   pathParams: { hash },
  //   queryOptions: {
  //     enabled: Boolean(hash),
  //     placeholderData: ADDRESS_TABS_COUNTERS,
  //   },
  // });

  const contractTabs = useContractTabs(addressQuery.dataResult);

  const tabs: Array<RoutedTab> = React.useMemo(() => {
    return [
      {
        id: 'txs',
        title: 'Transactions',
        component: <AddressTxs scrollRef={ tabsScrollRef }/>,
      },
      config.features.beaconChain.isEnabled ?
        {
          id: 'withdrawals',
          title: 'Withdrawals',
          component: <AddressWithdrawals scrollRef={ tabsScrollRef }/>,
        } :
        undefined,
      {
        id: 'token_transfers',
        title: 'Token transfers',
        component: <AddressTokenTransfers scrollRef={ tabsScrollRef }/>,
      },
      {
        id: 'tokens',
        title: 'Tokens',
        component: <AddressTokens/>,
        subTabs: TOKEN_TABS,
      },
      {
        id: 'internal_txns',
        title: 'Internal txns',
        component: <AddressInternalTxs scrollRef={ tabsScrollRef }/>,
      },
      // {
      //   id: 'coin_balance_history',
      //   title: 'Coin balance history',
      //   component: <AddressCoinBalance/>,
      // },
      // config.chain.verificationType === 'validation' ?
      //   {
      //     id: 'blocks_validated',
      //     title: 'Blocks validated',
      //     component: <AddressBlocksValidated scrollRef={ tabsScrollRef }/>,
      //   } :
      //   undefined,
      {
        id: 'logs',
        title: 'Logs',
        component: <AddressLogs scrollRef={ tabsScrollRef }/>,
      },
      addressQuery.dataResult?.is_contract ? {
        id: 'contract',
        title: () => {
          if (addressQuery.dataResult.is_verified) {
            return (
              <>
                <span>Contract</span>
                <Icon as={ iconSuccess } boxSize="14px" color="green.500" ml={ 1 }/>
              </>
            );
          }

          return 'Contract';
        },
        component: <AddressContract tabs={ contractTabs }/>,
        subTabs: contractTabs.map(tab => tab.id),
      } : undefined,
    ].filter(Boolean);
  }, [ addressQuery.dataResult, contractTabs]);

  const tags = (
    <EntityTags
      data={ addressQuery.dataResult }
      isLoading={ addressQuery.isPlaceholderData }
      tagsBefore={ [
        addressQuery.dataResult?.is_contract ? { label: 'contract', display_name: 'Contract' } : { label: 'eoa', display_name: 'EOA' },
        addressQuery.dataResult?.implementation_address ? { label: 'proxy', display_name: 'Proxy' } : undefined,
        addressQuery.dataResult?.token ? { label: 'token', display_name: 'Token' } : undefined,
      ] }
      contentAfter={
        <NetworkExplorers type="address" pathParam={ hash } ml="auto" hideText={ isMobile }/>
      }
    />
  );

  const content = addressQuery.isError ? null : <RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/>;

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/accounts');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to top accounts list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `${ addressQuery.dataResult?.is_contract ? 'Contract' : 'Address' } details` }
        backLink={ backLink }
        contentAfter={ tags }
        isLoading={ addressQuery.isPlaceholderData }
      />
      <AddressDetails addressQuery={ addressQuery } scrollRef={ tabsScrollRef }/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ tabsScrollRef }></Box>
      { (addressQuery.isPlaceholderData) ? <TabsSkeleton tabs={ tabs }/> : content }
    </>
  );
};

export default AddressPageContent;
