import React, { useState, useMemo, useEffect } from 'react';
import { ChainData } from '@/types';
import ChainCard from '@/components/ChainCard';
import SkeletonCard from '@/components/SkeletonCard';
import Pagination from '@/components/Pagination';

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
};

const ITEMS_PER_PAGE = 16;

export default function ChainList({ chains, searchTerm, isLoading, filters, featuredChains }: Props) {
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
      <div className="w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(16)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {currentChains.map(([chainId, data]) => (
          <ChainCard key={chainId} chainId={chainId} featured={featuredChains.includes(chainId)} {...data} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
