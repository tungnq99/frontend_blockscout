import { Button, Icon } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useToast from 'lib/hooks/useToast';
import * as mixpanel from 'lib/mixpanel/index';
import useAddOrSwitchChain from 'lib/web3/useAddOrSwitchChain';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';
import { useAccount } from 'wagmi';

const feature = config.features.web3Wallet;

const NetworkAddToWallet = () => {
  const toast = useToast();
  const { provider, wallet } = useProvider();
  const addOrSwitchChain = useAddOrSwitchChain();
  const [address, setAddress] = React.useState(null)
  
  const handleClick = React.useCallback(async() => {
    if (!wallet || !provider) {
      return;
    }

    try {
      await addOrSwitchChain();
      const accounts = await provider.request({method: 'eth_requestAccounts'});    

      if (accounts?.length > 0) {
        // @ts-ignore:
        setAddress(accounts[0].substring(0,5) + "..." + accounts[0].substring(accounts[0].length - 5, accounts[0].length -1));
      } 

      toast({
        position: 'top-right',
        title: 'Success',
        description: 'Successfully added network to your wallet',
        status: 'success',
        variant: 'subtle',
        isClosable: true,
      });

      mixpanel.logEvent(mixpanel.EventTypes.ADD_TO_WALLET, {
        Target: 'network',
        Wallet: wallet,
      });

    } catch (error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [ addOrSwitchChain, provider, toast, wallet ]);

  if (!provider || !wallet || !config.chain.rpcUrl || !feature.isEnabled) {
    return null;
  }

  return (
    <>
       {address ? 
        <Button variant="outline" size="sm">
          <Icon as={ WALLETS_INFO[wallet].icon } boxSize={ 5 } mr={ 2 }/>
             {address}
        </Button> : 
        <Button variant="outline" size="sm" onClick={ handleClick }>
          <Icon as={ WALLETS_INFO[wallet].icon } boxSize={ 5 } mr={ 2 }/>
            Connect
        </Button>
        }
    </>
  );
};

export default React.memo(NetworkAddToWallet);
