import { Icon, Box, Flex, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import burgerIcon from 'icons/burger.svg';
import NavigationMobile from 'ui/snippets/navigation/NavigationMobile';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenuContentMobile from 'ui/snippets/networkMenu/NetworkMenuContentMobile';
import useNetworkMenu from 'ui/snippets/networkMenu/useNetworkMenu';

const Burger = () => {
  const iconColor = useColorModeValue('gray.600', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const networkMenu = useNetworkMenu();

  const handleNetworkMenuButtonClick = React.useCallback(() => {
    networkMenu.onToggle();
  }, [ networkMenu ]);

  const handleNetworkLogoClick = React.useCallback((event: React.SyntheticEvent) => {
    networkMenu.isOpen && event.preventDefault();
    networkMenu.onClose();
  }, [ networkMenu ]);

  return (
    <>
      <Box padding={ 2 } onClick={ onOpen }>
        <Icon
          as={ burgerIcon }
          boxSize={ 6 }
          display="block"
          color={ iconColor }
          aria-label="Menu button"
        />
      </Box>
      <Drawer
        isOpen={ isOpen }
        placement="left"
        onClose={ onClose }
        autoFocus={ false }
      >
        <DrawerOverlay/>
        <DrawerContent maxWidth="260px">
          <DrawerBody p={ 6 } display="flex" flexDirection="column">
           
            <Flex alignItems="center" justifyContent="space-between">
              <NetworkLogo onClick={ handleNetworkLogoClick }/>
              
            </Flex>
            { networkMenu.isOpen ? <NetworkMenuContentMobile tabs={ networkMenu.availableTabs } items={ networkMenu.data }/> : <NavigationMobile/> }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Burger;
