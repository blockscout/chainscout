import React, { useState, useMemo } from 'react';
import { Chains } from '@/types';
import ChainCard from '@/components/ChainCard';
import SkeletonCard from '@/components/SkeletonCard';
import Pagination from '@/components/Pagination';

type Props = {
  chains: Chains;
  searchTerm: string;
  isLoading: boolean;
};

const ITEMS_PER_PAGE = 16;

export default function ChainList({ chains, searchTerm, isLoading }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredChains = useMemo(() => {
    return Object.entries(chains).filter(([_, data]) =>
      data.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [chains, searchTerm]);

  const totalPages = Math.ceil(filteredChains.length / ITEMS_PER_PAGE);

  const currentChains = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredChains.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredChains, currentPage]);

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
