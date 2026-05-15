import Image from 'next/image';
import Link from 'next/link';
import { ChainData } from '@/types';
import { ROLLUP_TYPES, RollupType } from '@/utils/constants';
import { HostedByBadge } from '@/components/ChainBadges';
import Tooltip from '@/components/Tooltip';
import CompassIcon from '@/icons/compass.svg';
import GlobeIcon from '@/icons/globe.svg';
import InfoIcon from '@/icons/info.svg';

type ChainTableProps = {
  chains: Array<[string, ChainData]>;
  featuredChains: string[];
};

export default function ChainTable({ chains, featuredChains }: ChainTableProps) {
  if (chains.length === 0) return null;

  return (
    <div className="w-full">
      <div className="min-w-[836px] rounded-t-lg bg-white">
        <div className="grid h-10 grid-cols-[280px_32px_200px_24px_minmax(0,1fr)_88px] items-center rounded-t-lg bg-[#F5F5F6] px-3 text-sm font-medium text-[#646474]">
          <div>Name</div>
          <div aria-hidden="true" />
          <div>Hosted By</div>
          <div aria-hidden="true" />
          <div>Tags</div>
          <div aria-hidden="true" />
        </div>
        <div className="divide-y divide-[#F5F5F6] border-b border-[#F5F5F6]">
          {chains.map(([chainId, data]) => (
            <ChainTableRow
              key={chainId}
              chainId={chainId}
              featured={featuredChains.includes(chainId)}
              {...data}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const TableTag = ({ children }: { children: string }) => (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-sm font-normal bg-[#f4f5f6] text-[#6b6b74]">
    {children}
  </span>
);

function ChainTableRow({
  name,
  description,
  layer,
  rollupType,
  explorers,
  isTestnet,
  website,
  logo,
  ecosystem,
  featured,
}: ChainData & { chainId: string; featured: boolean }) {
  const { hostedBy, url } = explorers[0];
  const ecosystemTags = Array.isArray(ecosystem) ? ecosystem : [ecosystem];

  return (
    <div className="grid min-h-[76px] grid-cols-[280px_32px_200px_24px_minmax(0,1fr)_88px] items-center px-3 py-[14px]">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex shrink-0 items-center gap-4">
          {featured ? (
            <Image
              src="/star.svg"
              alt="Featured Chain"
              width={32}
              height={32}
              className="shrink-0"
            />
          ) : (
            <span className="h-8 w-8 shrink-0" aria-hidden="true" />
          )}
          <Tooltip label={description} placement="right">
            <button
              type="button"
              className="flex h-5 w-5 items-center justify-center text-[#7F8490] transition-colors hover:text-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
              aria-label={`${name} description`}
            >
              <InfoIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <Image
            src={logo}
            alt={`${name} logo`}
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 rounded"
          />
          <span className="truncate text-sm font-medium text-[#1D1D1F]">{name}</span>
        </div>
      </div>

      <div aria-hidden="true" />

      <div>
        <HostedByBadge hostedBy={hostedBy} />
      </div>

      <div aria-hidden="true" />

      <div className="flex min-w-0 flex-wrap gap-2">
        <TableTag>{`L${layer}`}</TableTag>
        {rollupType && <TableTag>{`${ROLLUP_TYPES[rollupType as RollupType]} Rollup`}</TableTag>}
        <TableTag>{isTestnet ? 'Testnet' : 'Mainnet'}</TableTag>
        {ecosystemTags.map((eco, index) => (
          <TableTag key={`${eco}-${index}`}>{eco}</TableTag>
        ))}
      </div>

      <div className="flex items-center justify-end">
        <Tooltip label="Project Website" placement="left" offsetY={-8} showLinkIcon>
          <Link
            href={website}
            target="_blank"
            rel="noopener"
            aria-label={`${name} project website`}
            className="flex h-9 w-9 items-center justify-center text-[#7F8490] transition-colors hover:text-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
          >
            <GlobeIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
        </Tooltip>
        <Tooltip label="Blockscout Explorer" placement="left" offsetY={-8} showLinkIcon>
          <Link
            href={url}
            target="_blank"
            rel="noopener"
            aria-label={`${name} Blockscout explorer`}
            className="flex h-9 w-9 items-center justify-center text-[#7F8490] transition-colors hover:text-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
          >
            <CompassIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}
