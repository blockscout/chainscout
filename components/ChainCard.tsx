import { ChainData } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

type HostingType = 'blockscout' | 'conduit' | 'self';

const hostingColors: Record<HostingType, { bg: string; text: string }> = {
  blockscout: { bg: '#91eabf', text: '#006635' },
  conduit: { bg: '#31e3e3', text: '#0a0a0a' },
  self: { bg: '#c2d9ff', text: '#003180' },
};

const Tag = ({ children }: { children: string }) => (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-sm font-medium bg-[#f4f5f6] text-[#6b6b74]">
    {children}
  </span>
);

export default function ChainCard({
  chainId,
  name,
  description,
  layer,
  rollupType,
  explorers,
  isTestnet,
}: ChainData & { chainId: string }) {
  const [imgSrc, setImgSrc] = useState(`/chains/${chainId}.png`);
  const { hostedBy } = explorers[0];
  const hostedByText = hostedBy.toLowerCase() === 'self' ? 'Self-hosted' : `Hosted by ${hostedBy}`;
  const colors = hostingColors[hostedBy.toLowerCase() as HostingType] || hostingColors.blockscout;

  return (
    <div className="bg-white p-6 flex flex-col border rounded-[20px] hover:shadow-[20px_0_40px_rgba(183,183,183,.1),2px_0_20px_rgba(183,183,183,.08)] transition-shadow duration-[400ms] ease-[cubic-bezier(.39, .575, .565, 1)]">
      <div className="flex justify-between items-start mb-6">
        <span
          className="inline-flex items-center px-2 py-1 rounded text-sm font-medium"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {hostedByText}
        </span>
      </div>
      <div className="flex items-center mb-4 gap-3">
        <div className="w-12 h-12 flex-shrink-0">
          <Image
            src={imgSrc}
            alt={`${name} logo`}
            width={48}
            height={48}
            className="rounded-lg"
            onError={() => {
              setImgSrc('/placeholder-logo.png'); // Set to placeholder if original image fails
            }}
          />
        </div>
        <h3 className="text-[22px] font-semibold text-gray-900">{name}</h3>
      </div>
      <p className="text-gray-600 mb-[60px] flex-1">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        <Tag>{`L${layer}`}</Tag>
        {rollupType && <Tag>{`${rollupType} Rollup`}</Tag>}
        <Tag>{isTestnet ? 'Testnet' : 'Mainnet'}</Tag>
      </div>
    </div>
  );
}
