import React, { useState, useMemo, useEffect } from 'react';
import { ChainData } from '@/types';
import ChainCard from '@/components/ChainCard';
import ChainTable from '@/components/ChainTable';
import SkeletonCard from '@/components/SkeletonCard';
import SkeletonTable from '@/components/SkeletonTable';
import Pagination from '@/components/Pagination';
import { ViewMode } from '@/components/ViewToggle';

type Props = {
  chains: Array<[string, ChainData]>;
  searchTerm: string;
  isLoading: boolean;
  filters: {
    hosting: string[];
    networkTypes: string[];
    ecosystems: string[];
  };
  featuredChains: string[];
  viewMode: ViewMode;
};

const ITEMS_PER_PAGE = 16;

function CardGrid({
  chains,
  featuredChains,
  className = '',
}: {
  chains: Array<[string, ChainData]>;
  featuredChains: string[];
  className?: string;
}) {
  return (
    <div className={`w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {chains.map(([chainId, data]) => (
        <ChainCard key={chainId} chainId={chainId} featured={featuredChains.includes(chainId)} {...data} />
      ))}
    </div>
  );
}

function SkeletonCardGrid({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {[...Array(16)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export default function ChainList({ chains, searchTerm, isLoading, filters, featuredChains, viewMode }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const currentChains = useMemo(() => {
    const chainsArray = [...chains];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return chainsArray.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [chains, currentPage]);

  const totalPages = Math.ceil(chains.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, chains]);

  if (isLoading) {
    return (
      <>
        <SkeletonCardGrid className={viewMode === 'list' ? 'min-[1000px]:hidden' : ''} />
        {viewMode === 'list' && (
          <div className="hidden w-full min-[1000px]:block">
            <SkeletonTable />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {viewMode === 'list' ? (
        <>
          <CardGrid
            chains={currentChains}
            featuredChains={featuredChains}
            className="min-[1000px]:hidden"
          />
          <div className="hidden w-full min-[1000px]:block">
            <ChainTable chains={currentChains} featuredChains={featuredChains} />
          </div>
        </>
      ) : (
        <CardGrid chains={currentChains} featuredChains={featuredChains} />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
