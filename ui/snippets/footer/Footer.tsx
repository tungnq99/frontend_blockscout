import { Box, Grid, Flex, Text, Link, VStack, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import redditIcon from 'icons/social/reddit_filled.svg';
import teleIcon from 'icons/social/telegram_filled.svg';
import discordIcon from 'icons/social/discord.svg';
import gitIcon from 'icons/social/git.svg';
import twitterIcon from 'icons/social/tweet.svg';
import LinkendinIcon from 'icons/social/linkedin_filled.svg';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useFetch from 'lib/hooks/useFetch';
import useIssueUrl from 'lib/hooks/useIssueUrl';
import IndexingAlertIntTxs from 'ui/home/IndexingAlertIntTxs';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import ColorModeToggler from '../header/ColorModeToggler';
import FooterLinkItem from './FooterLinkItem';
import getApiVersionUrl from './utils/getApiVersionUrl';
import NetworkLogo from '../networkMenu/NetworkLogo';

const MAX_LINKS_COLUMNS = 3;

const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${ config.UI.footer.frontendVersion }`;
const Footer = () => {

  const { data: backendVersionData } = useApiQuery('config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
    },
  });
  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  const issueUrl = useIssueUrl(backendVersionData?.backend_version);
  const isCollapsed = false;
  const BLOCKSCOUT_LINKS = [
    {
      icon: teleIcon,
      iconSize: '20px',
      text: 'Telegram',
      url: 'https://telegram.org/',
    },
    {
      icon: gitIcon,
      iconSize: '18px',
      text: 'Github',
      url: 'https://github.com/',
    },
    {
      icon: twitterIcon,
      iconSize: '18px',
      text: 'Twitter',
      url: 'https://www.twitter.com/',
    },
    {
      icon: discordIcon,
      iconSize: '18px',
      text: 'Discord',
      url: 'https://discord.gg/',
    },
    {
      icon: redditIcon,
      iconSize: '18px',
      text: 'Reddit',
      url: 'https://www.reddit.com/?rdt=38449',
    },
    {
      icon: LinkendinIcon,
      iconSize: '18px',
      text: 'Linkedin',
      url: 'https://www.linkedin.com/',
    }
  ];

  const fetch = useFetch();

  const { isLoading, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>(
    [ 'footer-links' ],
    async() => fetch(config.UI.footer.links || ''),
    {
      enabled: Boolean(config.UI.footer.links),
      staleTime: Infinity,
    });

  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      p={{ base: 4, lg: 9 }}
      borderTop="1px solid"
      borderColor="divider"
      as="footer"
      columnGap="100px"
    >
      <Box flexGrow="1" mb={{ base: 8, lg: 0 }}>
        <Flex flexWrap="wrap" columnGap={ 8 } rowGap={ 6 }>
          <ColorModeToggler/>
          { !config.UI.indexingAlert.isHidden && <IndexingAlertIntTxs/> }
          <NetworkAddToWallet/>
        </Flex>
        <Box mt={{ base: 5, lg: '44px' }}>
            <NetworkLogo isCollapsed={ isCollapsed }/>
        </Box>
        <Text mt={ 3 } maxW={{ base: 'unset', lg: '470px' }} fontSize="xs">
            ZENODE is a tool for inspecting and analyzing EVM based blockchains. Blockchain explorer for Ethereum Networks.
        </Text>
      </Box>
      <Grid
        gap={{ base: 6, lg: 12 }}
        gridTemplateColumns={ config.UI.footer.links ?
          { base: 'repeat(auto-fill, 160px)', lg: `repeat(${ (linksData?.length || MAX_LINKS_COLUMNS) + 1 }, 160px)` } :
          'auto'
        }
      >
        <Box minW="160px" w={ config.UI.footer.links ? '160px' : '100%' }>
          { config.UI.footer.links && <Text fontWeight={ 500 } mb={ 3 }>Blockscout</Text> }
          <Grid
            gap={ 1 }
            gridTemplateColumns={ config.UI.footer.links ? '160px' : { base: 'repeat(auto-fill, 160px)', lg: 'repeat(3, 160px)' } }
            gridTemplateRows={{ base: 'auto', lg: config.UI.footer.links ? 'auto' : 'repeat(2, auto)' }}
            gridAutoFlow={{ base: 'row', lg: config.UI.footer.links ? 'row' : 'column' }}
            mt={{ base: 0, lg: config.UI.footer.links ? 0 : '100px' }}
          >
            { BLOCKSCOUT_LINKS.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
          </Grid>
        </Box>
        { config.UI.footer.links && isLoading && (
          Array.from(Array(3)).map((i, index) => (
            <Box minW="160px" key={ index }>
              <Skeleton w="120px" h="20px" mb={ 6 }/>
              <VStack spacing={ 5 } alignItems="start" mb={ 2 }>
                { Array.from(Array(5)).map((i, index) => <Skeleton w="160px" h="14px" key={ index }/>) }
              </VStack>
            </Box>
          ))
        ) }
        { config.UI.footer.links && linksData && (
          linksData.slice(0, MAX_LINKS_COLUMNS).map(linkGroup => (
            <Box minW="160px" key={ linkGroup.title }>
              <Text fontWeight={ 500 } mb={ 3 }>{ linkGroup.title }</Text>
              <VStack spacing={ 1 } alignItems="start">
                { linkGroup.links.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
              </VStack>
            </Box>
          ))
        ) }
      </Grid>
    </Flex>
  );
};

export default Footer;
