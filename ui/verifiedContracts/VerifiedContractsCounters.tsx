import { Flex, Skeleton } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import useApiQuery from 'lib/api/useApiQuery';

import VerifiedContractsCountersItem from './VerifiedContractsCountersItem';
import useMultiAPI from 'playwright/utils/useMultiApi';

const VerifiedContractsCounters = () => {
  const { data, isError, isPlaceholderData, pagination, callback } = useMultiAPI("smart-contracts/counters");

  function totalSum(num: any, name: any) {
    if (data?.length > 0) {
      for (let index = 0; index < data?.length; index++) {
        num += Number(data[index][name]);
      }
      return num.toString();
    }
  }
  
  if (isError) {
    return null;
  }

  const content = (() => {
    if (isPlaceholderData) {
      return (
        <>
            <Skeleton>
              <VerifiedContractsCountersItem
              name=""
              total=""
              new24=""
            />
            </Skeleton>
            <Skeleton>
              <VerifiedContractsCountersItem
                name=""
                total=""
                new24=""
              />
            </Skeleton>
        </>
      );
    }

    return (
      <>
        <VerifiedContractsCountersItem
          name="Total"
          total={ totalSum(0, "smart_contracts") }
          new24={ totalSum(0, "new_smart_contracts_24h")}
        />
        <VerifiedContractsCountersItem
          name="Verified"
          total={ totalSum(0, "verified_smart_contracts")}
          new24={ totalSum(0, "new_verified_smart_contracts_24h")}
        />
      </>
    );
  })();

  return (
    <Flex columnGap={ 3 } rowGap={ 3 } flexDirection={{ base: 'column', lg: 'row' }}>
      { content }
    </Flex>
  );
};

export default VerifiedContractsCounters;
