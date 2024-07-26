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

export const NETWORK_TYPES = {
  'l1': 'L1',
  'l2': 'L2',
  'l3': 'L3',
  'testnet': 'Testnet',
  'mainnet': 'Mainnet'
} as const;

export type HostingProvider = keyof typeof HOSTING_PROVIDERS;
export type RollupType = keyof typeof ROLLUP_TYPES;
export type NetworkType = keyof typeof NETWORK_TYPES;

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
