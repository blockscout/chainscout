import { HOSTING_PROVIDERS, HostingProvider } from '@/utils/constants';

export const hostingColors: Record<HostingProvider, { bg: string; text: string }> = {
  'blockscout': { bg: '#91eabf', text: '#006635' },
  'conduit': { bg: '#31e3e3', text: '#0a0a0a' },
  'gelato-raas': { bg: '#f37b84', text: '#202020' },
  'altlayer-raas': { bg: 'hsla(264.6428571428571, 100.00%, 78.04%, 1.00)', text: '#1c1e24' },
  'protofire': { bg: '#faa807', text: '#1c1e24' },
  'gateway': { bg: '#9368E8', text: '#ffffff' },
  'self': { bg: '#c2d9ff', text: '#003180' },
  'alchemy': { bg: '#363FF9', text: '#ffffff' },
  'caldera': { bg: '#FC5000', text: '#F7F6F3' },
};

export const Tag = ({ children }: { children: string }) => (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-sm font-medium bg-[#f4f5f6] text-[#6b6b74]">
    {children}
  </span>
);

export const HostedByBadge = ({ hostedBy }: { hostedBy: HostingProvider }) => {
  const hostedByText = HOSTING_PROVIDERS[hostedBy] || 'Unknown';
  const colors = hostingColors[hostedBy] || hostingColors.blockscout;

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {hostedBy === 'self' ? 'Self-hosted' : `Hosted by ${hostedByText}`}
    </span>
  );
};
