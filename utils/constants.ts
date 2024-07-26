export const HOSTING_PROVIDERS = {
  'blockscout': 'Blockscout',
  'conduit': 'Conduit',
  'gelato-raas': 'Gelato RaaS',
  'altlayer-raas': 'Altlayer',
  'self': 'Self-hosted'
} as const;

export const ROLLUP_TYPES = {
  'optimistic': 'Optimistic',
  'zk': 'zk'
} as const;

export type HostingProvider = keyof typeof HOSTING_PROVIDERS;
export type RollupType = keyof typeof ROLLUP_TYPES;
