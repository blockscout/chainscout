import React, { useState, useMemo } from 'react';
import { Chains } from '@/types';
import ChainCard from '@/components/ChainCard';
import SkeletonCard from '@/components/SkeletonCard';
import Pagination from '@/components/Pagination';

type Props = {
  chains: Chains;
  searchTerm: string;
  isLoading: boolean;
  filters: {
    hosting: string[];
    networkTypes: string[];
    ecosystems: string[];
  };
};

const ITEMS_PER_PAGE = 16;

export default function ChainList({ chains, searchTerm, isLoading, filters }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const currentChains = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return Object.entries(chains).slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [chains, currentPage]);

  const totalPages = Math.ceil(Object.keys(chains).length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="w-full mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(16)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="w-full mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {currentChains.map(([chainId, data]) => (
          <ChainCard key={chainId} chainId={chainId} {...data} />
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
