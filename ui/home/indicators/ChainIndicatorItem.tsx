import { Text, Flex, Box, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { ChainIndicatorId } from './types';
import type { HomeStats } from 'types/api/stats';

import useIsMobile from 'lib/hooks/useIsMobile';

interface Props {
  id: ChainIndicatorId;
  title: string;
  value: (stats: HomeStats) => string;
  icon: React.ReactNode;
  stats: UseQueryResult<HomeStats>;
}

const ChainIndicatorItem = ({ id, title, value, icon, stats }: Props) => {
  const isMobile = useIsMobile();

  const activeBgColorDesktop = useColorModeValue('white', 'gray.900');
  const activeBgColorMobile = useColorModeValue('white', 'black');
  const activeBgColor = isMobile ? activeBgColorMobile : activeBgColorDesktop;


  const valueContent = (() => {
    if (isMobile) {
      return null;
    }

    if (stats.isLoading) {
      return (
        <Skeleton
          h={ 3 }
          w="70px"
          my={ 1.5 }
          // ssr: isMobile = undefined, isLoading = true
          display={{ base: 'none', lg: 'block' }}
        />
      );
    }

    if (stats.isError) {
      return <Text variant="secondary" fontWeight={ 400 }>no data</Text>;
    }

    return <Text variant="black" fontWeight={ 600 } fontSize={{base: '24px', lg: '32px'}}>{ value(stats.data) }</Text>;
  })();

  return (
    <Box
      alignItems="center"
      columnGap={ 3 }
      p={ 4 }
      borderRadius="md"
      cursor="pointer"
      _hover={{
        activeBgColor,
        zIndex: 1,
      }}
    >
      
      <Flex mb={5}>
        { icon }
        <Text fontFamily="heading" fontWeight={ 500 } mx={3} fontSize={'3sm'}>{ title }</Text>
      </Flex>
      { valueContent }
    </Box>
  );
};

export default React.memo(ChainIndicatorItem);
