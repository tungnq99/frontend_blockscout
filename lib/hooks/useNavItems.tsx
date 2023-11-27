import { useRouter } from 'next/router';
import React from 'react';

import type { NavItemInternal, NavItem, NavGroupItem } from 'types/client/navigation-items';

import config from 'configs/app';
import abiIcon from 'icons/ABI.svg';
import apiKeysIcon from 'icons/API.svg';
import blocksIcon from 'icons/block.svg';
import dashboardIcon from 'icons/dashboard.svg';
import privateTagIcon from 'icons/privattags.svg';
import publicTagIcon from 'icons/publictags.svg';
import apiDocsIcon from 'icons/restAPI.svg';
import tokensIcon from 'icons/token.svg';
import topAccountsIcon from 'icons/top-accounts.svg';
import transactionsIcon from 'icons/transactions.svg';
import verifiedIcon from 'icons/verified.svg';
import watchlistIcon from 'icons/watchlist.svg';
import UserAvatar from 'ui/shared/UserAvatar';

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
  profileItem: NavItem;
}

export function isGroupItem(item: NavItem | NavGroupItem): item is NavGroupItem {
  return 'subItems' in item;
}

export function isInternalItem(item: NavItem): item is NavItemInternal {
  return 'nextRoute' in item;
}

export default function useNavItems(): ReturnType {
  const router = useRouter();
  const pathname = router.pathname;

  return React.useMemo(() => {
    //let blockchainNavItems: Array<NavItem> | Array<Array<NavItem>> = [];

    const topAccounts = {
      text: 'Address',
      nextRoute: { pathname: '/accounts' as const },
      icon: topAccountsIcon,
      isActive: pathname === '/accounts',
    };
    const blocks = {
      text: 'Blocks',
      nextRoute: { pathname: '/blocks' as const },
      icon: blocksIcon,
      isActive: pathname === '/blocks' || pathname === '/block/[height_or_hash]',
    };
    const txs = {
      text: 'Transactions',
      nextRoute: { pathname: '/txs' as const },
      icon: transactionsIcon,
      isActive: pathname === '/txs' || pathname === '/tx/[hash]',
    };
    const verifiedContracts =
    // eslint-disable-next-line max-len
     { text: 'Verified contracts', nextRoute: { pathname: '/verified-contracts' as const }, icon: verifiedIcon, isActive: pathname === '/verified-contracts' };

    // if (config.features.rollup.isEnabled) {
    //   blockchainNavItems = [
    //     [
    //       txs,
    //       eslint-disable-next-line max-len
    //       { text: `Deposits (L1${ rightLineArrow }L2)`, nextRoute: { pathname: '/l2-deposits' as const }, icon: depositsIcon, isActive: pathname === '/l2-deposits' },
    //       eslint-disable-next-line max-len
    //       { text: `Withdrawals (L2${ rightLineArrow }L1)`, nextRoute: { pathname: '/l2-withdrawals' as const }, icon: withdrawalsIcon, isActive: pathname === '/l2-withdrawals' },
    //     ],
    //     [
    //       blocks,
    //       eslint-disable-next-line max-len
    //       { text: 'Txn batches', nextRoute: { pathname: '/l2-txn-batches' as const }, icon: txnBatchIcon, isActive: pathname === '/l2-txn-batches' },
    //       eslint-disable-next-line max-len
    //       { text: 'Output roots', nextRoute: { pathname: '/l2-output-roots' as const }, icon: outputRootsIcon, isActive: pathname === '/l2-output-roots' },
    //     ],
    //     [
    //       topAccounts,
    //       verifiedContracts,
    //     ],
    //   ];
    // } else {
    //   blockchainNavItems = [
    //     txs,
    //     blocks,
    //     topAccounts,
    //     verifiedContracts,
    //     config.features.beaconChain.isEnabled && {
    //       text: 'Withdrawals',
    //       nextRoute: { pathname: '/withdrawals' as const },
    //       icon: withdrawalsIcon,
    //       isActive: pathname === '/withdrawals',
    //     },
    //   ].filter(Boolean);
    // }

    // const apiNavItems: Array<NavItem> = [
    //   config.features.restApiDocs.isEnabled ? {
    //     text: 'REST API',
    //     nextRoute: { pathname: '/api-docs' as const },
    //     icon: apiDocsIcon,
    //     isActive: pathname === '/api-docs',
    //   } : null,
    // ].filter(Boolean);

    const mainNavItems: ReturnType['mainNavItems'] = [
      {
        text: 'Dashboard',
        nextRoute: { pathname: '/' as const },
        icon: dashboardIcon,
        isActive: pathname === '/',
      },
      blocks,
      verifiedContracts,
      txs,
      {
        text: 'Tokens',
        nextRoute: { pathname: '/tokens' as const },
        icon: tokensIcon,
        isActive: pathname.startsWith('/token'),
      },
      topAccounts,
      // config.features.marketplace.isEnabled ? {
      //   text: 'Apps',
      //   nextRoute: { pathname: '/apps' as const },
      //   icon: appsIcon,
      //   isActive: pathname.startsWith('/app'),
      // } : null,
      // config.features.stats.isEnabled ? {
      //   text: 'Charts & stats',
      //   nextRoute: { pathname: '/stats' as const },
      //   icon: statsIcon,
      //   isActive: pathname === '/stats',
      // } : null,
      // {
      //   text: 'Withdrawals',
      //   nextRoute: { pathname: '/withdrawals' as const },
      //   icon: withdrawalsIcon,
      //   isActive: pathname === '/withdrawals',
      // },
      config.features.restApiDocs.isEnabled ? {
        text: 'REST API',
        nextRoute: { pathname: '/api-docs' as const },
        icon: apiDocsIcon,
        isActive: pathname === '/api-docs',
      } : null,
    ].filter(Boolean);

    const accountNavItems: ReturnType['accountNavItems'] = [
      {
        text: 'Watch list',
        nextRoute: { pathname: '/account/watchlist' as const },
        icon: watchlistIcon,
        isActive: pathname === '/account/watchlist',
      },
      {
        text: 'Private tags',
        nextRoute: { pathname: '/account/tag-address' as const },
        icon: privateTagIcon,
        isActive: pathname === '/account/tag-address',
      },
      {
        text: 'Public tags',
        nextRoute: { pathname: '/account/public-tags-request' as const },
        icon: publicTagIcon, isActive: pathname === '/account/public-tags-request',
      },
      {
        text: 'API keys',
        nextRoute: { pathname: '/account/api-key' as const },
        icon: apiKeysIcon, isActive: pathname === '/account/api-key',
      },
      {
        text: 'Custom ABI',
        nextRoute: { pathname: '/account/custom-abi' as const },
        icon: abiIcon,
        isActive: pathname === '/account/custom-abi',
      },
      config.features.addressVerification.isEnabled && {
        text: 'Verified addrs',
        nextRoute: { pathname: '/account/verified-addresses' as const },
        icon: verifiedIcon,
        isActive: pathname === '/account/verified-addresses',
      },
    ].filter(Boolean);

    const profileItem = {
      text: 'My profile',
      nextRoute: { pathname: '/auth/profile' as const },
      iconComponent: UserAvatar,
      isActive: pathname === '/auth/profile',
    };

    return { mainNavItems, accountNavItems, profileItem };
  }, [ pathname ]);
}
