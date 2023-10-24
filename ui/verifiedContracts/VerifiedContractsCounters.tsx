import { Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';

import VerifiedContractsCountersItem from './VerifiedContractsCountersItem';

const VerifiedContractsCounters = () => {
  const countersQuery = useApiQuery('verified_contracts_counters');

  if (countersQuery.isError) {
    return null;
  }

  const content = (() => {
    if (countersQuery.isLoading) {
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
          total={ countersQuery.data.smart_contracts }
          new24={ countersQuery.data.new_smart_contracts_24h }
        />
        <VerifiedContractsCountersItem
          name="Verified"
          total={ countersQuery.data.verified_smart_contracts }
          new24={ countersQuery.data.new_verified_smart_contracts_24h }
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
