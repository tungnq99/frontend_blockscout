import { Box, Flex, Text, Icon, VStack, useColorModeValue, Link, Center } from '@chakra-ui/react';
import { animate, motion, useMotionValue } from 'framer-motion';
import React, { useCallback } from 'react';

import useHasAccount from 'lib/hooks/useHasAccount';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import NavLink from 'ui/snippets/navigation/NavLink';
import redditIcon from 'icons/social/reddit_filled.svg';
import teleIcon from 'icons/social/telegram_filled.svg';
import discordIcon from 'icons/social/discord.svg';
import twitterIcon from 'icons/social/tweet.svg';

import NavLinkGroupMobile from './NavLinkGroupMobile';

const NavigationMobile = () => {
  const { mainNavItems, accountNavItems } = useNavItems();

  const [ openedGroupIndex, setOpenedGroupIndex ] = React.useState(-1);

  const mainX = useMotionValue(0);
  const subX = useMotionValue(250);

  const onGroupItemOpen = (index: number) => () => {
    setOpenedGroupIndex(index);
    animate(mainX, -250, { ease: 'easeInOut' });
    animate(subX, 0, { ease: 'easeInOut' });
  };

  const onGroupItemClose = useCallback(() => {
    animate(mainX, 0, { ease: 'easeInOut' });
    animate(subX, 250, { ease: 'easeInOut', onComplete: () => setOpenedGroupIndex(-1) });
  }, [ mainX, subX ]);

  const hasAccount = useHasAccount();

  const iconColor = useColorModeValue('blue.600', 'blue.300');

  const openedItem = mainNavItems[openedGroupIndex];

  
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
    <Flex position="relative" flexDirection="column" flexGrow={ 1 }>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={ 1 }
        as={ motion.div }
        style={{ x: mainX }}
        maxHeight={ openedGroupIndex > -1 ? '100vh' : 'unset' }
        overflowY={ openedGroupIndex > -1 ? 'hidden' : 'unset' }
      >
        <Box
          as="nav"
          mt={ 6 }
        >
          <VStack
            w="100%"
            as="ul"
            spacing="1"
            alignItems="flex-start"
          >
            { mainNavItems.map((item, index) => {
              if (isGroupItem(item)) {
                return <NavLinkGroupMobile key={ item.text } item={ item } onClick={ onGroupItemOpen(index) }/>;
              } else {
                return <NavLink key={ item.text } item={ item }/>;
              }
            }) }
          </VStack>
        </Box>
        <Box as="nav" mt={ 20 } w="100%" h="50%" display="flex" alignItems="flex-end">
          <VStack as="ul" spacing="1" >
              <Flex justifyContent="space-between" alignItems="center" gap={6}>
                  {BLOCKSCOUT_LINKS.map((item) => {
                    return <Link href={ item.url } variant="secondary" target="_blank" fontSize="xs">
                            { item.icon && (
                              <Center minW={ 6 } mr="6px">
                                <Icon boxSize={ item.iconSize} as={ item.icon }/>
                              </Center>
                            ) }
                          </Link> 
                  })}
              </Flex>
          </VStack>
        </Box>
        {/* { hasAccount && (
          <Box
            as="nav"
            mt={ 6 }
            pt={ 6 }
            borderTopWidth="1px"
            borderColor="divider"
          >
            <VStack as="ul" spacing="1" alignItems="flex-start">
              { accountNavItems.map((item) => <NavLink key={ item.text } item={ item }/>) }
            </VStack>
          </Box>
        ) } */}
      </Box>
      {/* { openedGroupIndex >= 0 && (
        <Box
          as={ motion.nav }
          w="100%"
          mt={ 6 }
          position="absolute"
          top={ 0 }
          style={{ x: subX }}
          key="sub"
        >
          <Flex alignItems="center" px={ 3 } py={ 2.5 } w="100%" h="50px" onClick={ onGroupItemClose } mb={ 1 }>
            <Icon as={ chevronIcon } boxSize={ 6 } mr={ 2 } color={ iconColor }/>
            <Text variant="secondary" fontSize="sm">{ mainNavItems[openedGroupIndex].text }</Text>
          </Flex>
          <Box
            w="100%"
            as="ul"
          >
            { isGroupItem(openedItem) && openedItem.subItems?.map(
              (item, index) => Array.isArray(item) ? (
                <Box
                  key={ index }
                  w="100%"
                  as="ul"
                  _notLast={{
                    mb: 2,
                    pb: 2,
                    borderBottomWidth: '1px',
                    borderColor: 'divider',
                  }}
                >
                  { item.map(subItem => <NavLink key={ subItem.text } item={ subItem }/>) }
                </Box>
              ) :
                <NavLink key={ item.text } item={ item } mb={ 1 }/>,
            ) }
          </Box>
        </Box>
      ) } */}
    </Flex>
  );
};

export default NavigationMobile;
