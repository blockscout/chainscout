import { ChainData } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ROLLUP_TYPES, RollupType } from '@/utils/constants';
import { HostedByBadge, Tag } from '@/components/ChainBadges';
import LinkIcon from '@/icons/link.svg';

export default function ChainCard({
  chainId,
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
}: ChainData & { chainId: string, featured: boolean }) {
  const { hostedBy, url } = explorers[0];
  const ecosystemTags = Array.isArray(ecosystem) ? ecosystem : [ecosystem];
  const isClickFromLink = (target: EventTarget | null) => {
    return target instanceof HTMLElement && Boolean(target.closest('a'));
  };

  const openExplorer = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isFullCardClickEnabled = () => {
    return window.matchMedia('(min-width: 1000px)').matches;
  };

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isClickFromLink(event.target)) return;
    if (!isFullCardClickEnabled()) return;

    openExplorer();
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (isClickFromLink(event.target)) return;
    if (!isFullCardClickEnabled()) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    openExplorer();
  };

  return (
    <div
      className="bg-white p-6 flex flex-col border rounded-[20px] hover:shadow-[20px_0_40px_rgba(183,183,183,.1),2px_0_20px_rgba(183,183,183,.08)] transition-shadow duration-[400ms] ease-[cubic-bezier(.39, .575, .565, 1)] group cursor-pointer"
      role="link"
      tabIndex={0}
      aria-label={`Open ${name} explorer`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="flex justify-between items-center mb-6">
        <HostedByBadge hostedBy={hostedBy} />
        {featured && (
          <Image
            src="/star.svg"
            alt="Featured Chain"
            width={24}
            height={24}
            className="flex-shrink-0"
          />
        )}
      </div>
      <div className="flex items-center mb-4 gap-3">
        <Image
          src={logo}
          alt={`${name} logo`}
          width={56}
          height={56}
          className="rounded-lg w-[48px] h-[48px] md:w-[56px] md:h-[56px] flex-shrink-0"
        />
        <h3 className="text-xl md:text-[22px] font-semibold text-gray-900">{name}</h3>
      </div>
      <div className="flex flex-col flex-1 relative">
        <p className="text-gray-600 mb-[60px] flex-1">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          <Tag>{`L${layer}`}</Tag>
          {rollupType && <Tag>{`${ROLLUP_TYPES[rollupType as RollupType]} Rollup`}</Tag>}
          <Tag>{isTestnet ? 'Testnet' : 'Mainnet'}</Tag>
          {ecosystemTags.map((eco, index) => (
            <Tag key={index}>{eco}</Tag>
          ))}
        </div>

        {/* Hover effect block */}
        <div className="absolute inset-0 bg-white flex flex-col justify-end opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
          {[
            { href: website, text: 'Project Website' },
            { href: url, text: 'Blockscout Explorer' },
          ].map(({ href, text }, index, array) => (
            <React.Fragment key={index}>
              <Link href={href} className="group/link flex items-center justify-between py-3" target="_blank" rel="noopener">
                <span className="text-sm font-medium text-black group-hover/link:text-blue-600 transition-colors duration-[400ms]">
                  {text}
                </span>
                <LinkIcon className="w-3 h-3 flex-shrink-0 text-[#B1B5C3] group-hover/link:text-blue-600 transition-colors duration-[400ms]"/>
              </Link>
              {index < array.length - 1 && <div className="border-t border-gray-200 my-3"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
