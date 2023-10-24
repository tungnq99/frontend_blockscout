import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

type Props = {
  name: string;
  total: string;
  new24: string;
}

const VerifiedContractsCountersItem = ({ name, total, new24 }: Props) => {
  const itemBgColor = useColorModeValue('blue.50', 'blue.800');
  return (
    <Flex
      w='100%'
      borderRadius="12px"
      backgroundColor={ itemBgColor }
      p={ 2 }
      alignItems="center"
    >
      <Text variant="secondary" fontSize="xs" mr={2}>{ name }:</Text>
      <Flex alignItems="baseline">
        <Text fontWeight={ 600 } mr={ 2 } fontSize="sm">{ Number(total).toLocaleString() }</Text>
        { Number(new24) > 0 && (
          <>
            <Text fontWeight={ 600 } mr={ 1 } fontSize="2xs" color="green.500">+{ Number(new24).toLocaleString() }</Text>
            <Text variant="secondary" fontSize="sm">(24h)</Text>
          </>
        ) }
      </Flex>
    </Flex>
  );
};

export default VerifiedContractsCountersItem;
