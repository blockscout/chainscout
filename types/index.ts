export type Explorer = {
  url: string;
  hostedBy: string;
};

export type ChainData = {
  name: string;
  description: string;
  ecosystem: string;
  isTestnet: boolean | undefined;
  layer: 1 | 2 | 3;
  rollupType: 'Optimistic' | 'zk' | undefined;
  website: string;
  explorers: Explorer[];
};

export type Chains = {
  [chainId: string]: ChainData;
};
