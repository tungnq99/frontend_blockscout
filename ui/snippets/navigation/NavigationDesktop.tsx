import { Flex, Box, VStack, Icon, useColorModeValue, Link, Center } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import redditIcon from 'icons/social/reddit_filled.svg';
import teleIcon from 'icons/social/telegram_filled.svg';
import discordIcon from 'icons/social/discord.svg';
import twitterIcon from 'icons/social/tweet.svg';

import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import useHasAccount from 'lib/hooks/useHasAccount';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';

import NavLink from './NavLink';
import NavLinkGroupDesktop from './NavLinkGroupDesktop';

const NavigationDesktop = () => {
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;

  const isNavBarCollapsedCookie = cookies.get(cookies.NAMES.NAV_BAR_COLLAPSED, cookiesString);
  let isNavBarCollapsed;
  if (isNavBarCollapsedCookie === 'true') {
    isNavBarCollapsed = true;
  }
  if (isNavBarCollapsedCookie === 'false') {
    isNavBarCollapsed = false;
  }

  const { mainNavItems, accountNavItems } = useNavItems();

  const hasAccount = useHasAccount();

  const [ isCollapsed, setCollapsedState ] = React.useState<boolean | undefined>(isNavBarCollapsed);

  const handleTogglerClick = React.useCallback(() => {
    setCollapsedState((flag) => !flag);
    cookies.set(cookies.NAMES.NAV_BAR_COLLAPSED, isCollapsed ? 'false' : 'true');
  }, [ isCollapsed ]);

  const chevronIconStyles = {
    bgColor: useColorModeValue('white', 'black'),
    color: useColorModeValue('blue.400', 'blue.400'),
    borderColor: 'divider',
  };

  const isExpanded = isCollapsed === false;

  const BLOCKSCOUT_LINKS = [
    {
      icon: teleIcon,
      iconSize: '24px',
      url: 'https://telegram.org/',
    },
    {
      icon: twitterIcon,
      iconSize: '24px',
      url: 'https://www.twitter.com/',
    },
    {
      icon: discordIcon,
      iconSize: '24px',
      url: 'https://discord.gg/',
    },
    {
      icon: redditIcon,
      iconSize: '24px',
      text: 'Reddit',
      url: 'https://www.reddit.com/?rdt=38449',
    }
  ];

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      position='relative'
      flexDirection="column"
      alignItems="stretch"
      borderRight="1px solid"
      borderColor="divider"
      px={{ lg: isExpanded ? 6 : 4, xl: isCollapsed ? 4 : 6 }}
      py={ 12 }
      width={{ lg: isExpanded ? '235px' : '92px', xl: isCollapsed ? '92px' : '235px' }}
      { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
    >
      
      <Box position="fixed">
        <Box
          as="header"
          w="100%"
          h={ 10 }
          transitionProperty="padding"
          transitionDuration="normal"
          transitionTimingFunction="ease"
        >
          {/* { config.chain.isTestnet && <Icon as={ testnetIcon } h="14px" w="auto" color="red.400"  alignSelf="flex-start"/> } */}
          <NetworkLogo isCollapsed={ isCollapsed }/>
        </Box>
        <Box as="nav" mt={ 20 } w="100%">
          <VStack as="ul" spacing="1" alignItems="flex-start">
            { mainNavItems.map((item) => {
              if (isGroupItem(item)) {
                return <NavLinkGroupDesktop key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
              } else {
                return <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
              }
            }) }
          </VStack>
        </Box>
        <Box as="nav" mt={ 20 } w="100%" display="flex" alignItems="flex-end" justifyContent="center">
          <VStack as="ul" spacing="1" >
              <Flex justifyContent="space-between" alignItems="center" gap={6} flexDirection={{base: "column", xl: 'row'}}>
                  {BLOCKSCOUT_LINKS.map((item, index) => {
                    return <Link key={index} href={ item.url } variant="secondary" target="_blank" fontSize="xs">
                            { item.icon && (
                              <Center minW={ 6 }>
                                <Icon boxSize={ item.iconSize} as={ item.icon }/>
                              </Center>
                            ) }
                          </Link> 
                  })}
              </Flex>
          </VStack>
        </Box>
      </Box>
      {/* { hasAccount && (
        <Box as="nav" borderTopWidth="1px" borderColor="divider" w="100%" mt={ 6 } pt={ 6 }>
          <VStack as="ul" spacing="1" alignItems="flex-start">
            { accountNavItems.map((item) => <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>) }
          </VStack>
        </Box>
      ) } */}
      {/* <Icon
        as={ chevronIcon }
        width={ 6 }
        height={ 6 }
        border="1px"
        _hover={{ color: 'link_hovered' }}
        borderRadius="base"
        { ...chevronIconStyles }
        transform={{ lg: isExpanded ? 'rotate(0)' : 'rotate(180deg)', xl: isCollapsed ? 'rotate(180deg)' : 'rotate(0)' }}
        { ...getDefaultTransitionProps({ transitionProperty: 'transform, left' }) }
        transformOrigin="center"
        position="absolute"
        top="7%"
        left={{ lg: isExpanded ? '222px' : '80px', xl: isCollapsed ? '80px' : '222px' }}
        cursor="pointer"
        onClick={ handleTogglerClick }
        aria-label="Expand/Collapse menu"
      /> */}
    </Flex>
  );
};

export default NavigationDesktop;
