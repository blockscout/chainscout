import { HostingProvider, RollupType } from '@/utils/constants';

export type Explorer = {
  url: string;
  hostedBy: HostingProvider;
};

export type ChainData = {
  name: string;
  description: string;
  ecosystem: string;
  isTestnet: boolean | undefined;
  layer: 1 | 2 | 3;
  rollupType: RollupType | undefined;
  website: string;
  explorers: Explorer[];
  logo: string;
};

export type Chains = {
  [chainId: string]: ChainData;
};
