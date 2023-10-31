import { Box, Flex, Grid, LightMode, TooltipProps } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import blockIcon from 'icons/block.svg';
import clockIcon from 'icons/clock-light.svg';
import gasIcon from 'icons/gas.svg';
import txIcon from 'icons/transactions.svg';
import walletIcon from 'icons/wallet.svg';
import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/stats';

import StatsGasPrices from './StatsGasPrices';
import StatsItem from './StatsItem';
import { base } from 'nextjs/getServerSideProps';
import Hint from 'ui/shared/Hint';

const hasGasTracker = config.UI.homepage.showGasTracker;
const hasAvgBlockTime = config.UI.homepage.showAvgBlockTime;
type Props = {
  isGas: boolean;
}

const TOOLTIP_PROPS: Partial<TooltipProps> = {
  hasArrow: false,
  borderRadius: 'md',
  placement: 'bottom-end',
  offset: [ 0, 0 ],
  bgColor: 'blackAlpha.900',
};

const Stats = ({ isGas }:Props) => {
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  // if (isError) {
  //   return null;
  // }

  let content;

  const lastItemTouchStyle = { gridColumn: { base: 'span 2', lg: 'unset' } };

  let itemsCount = 5;
  !hasGasTracker && itemsCount--;
  !hasAvgBlockTime && itemsCount--;

  if (data) {
    !data.gas_prices && itemsCount--;
    const isOdd = Boolean(itemsCount % 2);
    const gasLabel = hasGasTracker && data.gas_prices ? <StatsGasPrices gasPrices={ data.gas_prices }/> : null;
    
    content = (
      <>
        {
          !isGas && <>
            <Flex gap={5} mb={5} mr={{base: 5, lg: 0}} flexWrap="wrap">
              <StatsItem
                icon={ blockIcon }
                title="Total blocks"
                value={ Number(data.total_blocks).toLocaleString() }
                url={ route({ pathname: '/blocks' }) }
                isLoading={ isPlaceholderData }
              />
              { hasAvgBlockTime && (
                <StatsItem
                  icon={ clockIcon }
                  title="Average block time"
                  value={ `${ (data.average_block_time / 1000).toFixed(1) } s` }
                  isLoading={ isPlaceholderData }
                />
              ) }
            </Flex>
            <Flex gap={5} flexWrap="wrap">
              <StatsItem
                icon={ txIcon }
                title="Total transactions"
                value={ Number(data.total_transactions).toLocaleString() }
                url={ route({ pathname: '/txs' }) }
                isLoading={ isPlaceholderData }
              />
              <StatsItem
                icon={ walletIcon }
                title="Wallet addresses"
                value={ Number(data.total_addresses).toLocaleString() }
                _last={ isOdd ? lastItemTouchStyle : undefined }
                isLoading={ isPlaceholderData }
              />
            </Flex>
          </>
        }
        { hasGasTracker && data.gas_prices && isGas && (
          <Flex gap={3} fontSize={'md'} color={'white'} fontWeight={500}>
            <Box>Gas tracker : { Number(data.gas_prices.average).toLocaleString() } Gwei</Box>
            {/* <StatsItem
              icon={ gasIcon }
              title="Gas tracker"
              value={ `${ Number(data.gas_prices.average).toLocaleString() } Gwei` }
              _last={ isOdd ? lastItemTouchStyle : undefined }
              tooltipLabel={ gasLabel }
              isLoading={ isPlaceholderData }
            /> */}
        </Flex>
        ) }
      </>
    );
  }
  

  

  return (
    <Flex w="100%" flexDirection={{base: "row" , lg: "column"}}>
      { content }
    </Flex>

  );
};

export default Stats;
