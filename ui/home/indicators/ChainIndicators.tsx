import { Flex, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import Hint from 'ui/shared/Hint';

import ChainIndicatorChartContainer from './ChainIndicatorChartContainer';
import ChainIndicatorItem from './ChainIndicatorItem';
import useFetchChartData from './useFetchChartData';
import INDICATORS from './utils/indicators';

const indicators = INDICATORS
  .filter(({ id }) => config.UI.homepage.charts.includes(id))
  .sort((a, b) => {
    if (config.UI.homepage.charts.indexOf(a.id) > config.UI.homepage.charts.indexOf(b.id)) {
      return 1;
    }

    if (config.UI.homepage.charts.indexOf(a.id) < config.UI.homepage.charts.indexOf(b.id)) {
      return -1;
    }

    return 0;
  });

const ChainIndicators = () => {
  const [ selectedIndicator, selectIndicator ] = React.useState(indicators[0]?.id);
  const indicator = indicators.find(({ id }) => id === selectedIndicator);

  const queryResult = useFetchChartData(indicator);
  const statsQueryResult = useApiQuery('homepage_stats');

  const bgColorDesktop = useColorModeValue('white', 'gray.900');
  const bgColorMobile = useColorModeValue('white', 'black');
  const listBgColorDesktop = useColorModeValue('gray.50', 'black');
  const listBgColorMobile = useColorModeValue('gray.50', 'gray.900');

  if (indicators.length === 0) {
    return null;
  }

  const valueTitle = (() => {
    if (statsQueryResult.isLoading) {
      return <Skeleton h="48px" w="215px" mt={ 3 } mb={ 4 }/>;
    }

    if (statsQueryResult.isError) {
      return <Text mt={ 3 } mb={ 4 }>There is no data</Text>;
    }

    return (
      <Text fontWeight={ 600 } fontFamily="heading" fontSize="48px" lineHeight="48px" mt={ 3 } mb={ 4 } color="white">
        { indicator?.value(statsQueryResult.data) }
      </Text>
    );
  })();

  return (
    <Flex
      p={{ base: 0, lg: 8 }}
      borderRadius={{ base: 'none', lg: 'lg' }}
      columnGap={ 12 }
      rowGap={ 0 }
      flexDir={{ base: 'column', lg: 'row' }}
      w="100%"
      alignItems="stretch"
      mt={ 8 }
    >
      <Flex flexGrow={ 1 } flexDir="column" order={{ base: 2, lg: 1 }} p={{ base: 6, lg: 0 }} color="white">
        <Flex alignItems="center" color="white">
          <Text fontWeight={ 500 } fontFamily="heading" fontSize="lg" color="white">{ indicator?.title }</Text>
        </Flex>
        { valueTitle }
        <ChainIndicatorChartContainer { ...queryResult }/>
      </Flex>
      { indicators.length > 1 && (
        <Flex
          flexShrink={ 0 }
          flexDir="column"
          as="ul"
          p={ 3 }
          borderRadius="lg"
          bgColor={{ base: listBgColorMobile, lg: listBgColorDesktop }}
          rowGap={ 3 }
          order={{ base: 1, lg: 2 }}
        >
          { indicators.map((indicator) => (
            <ChainIndicatorItem
              key={ indicator.id }
              { ...indicator }
              isSelected={ selectedIndicator === indicator.id }
              onClick={ selectIndicator }
              stats={ statsQueryResult }
            />
          )) }
        </Flex>
      ) }
    </Flex>
  );
};

export default ChainIndicators;
