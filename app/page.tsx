'use client';

import { useState, useEffect, useMemo } from 'react';
import SearchBar from '@/components/SearchBar';
import ChainList from '@/components/ChainList';
import Filters from '@/components/Filters';
import { Chains } from '@/types';

async function getChainsData(): Promise<Chains> {
  const res = await fetch('/api/chains', {
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch chains data');
  }
  return res.json();
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [chainsData, setChainsData] = useState<Chains>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    hosting: [] as string[],
    networkTypes: [] as string[],
    ecosystems: [] as string[],
  });

  const ecosystems = useMemo(() => {
    if (!chainsData) return [];
    return Array.from(new Set(Object.values(chainsData).map(chain => chain.ecosystem)));
  }, [chainsData]);

  const appliedFiltersCount = useMemo(() => {
    return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);
  }, [filters]);

  const filteredChains = useMemo(() => {
    return Object.entries(chainsData).filter(([chainId, data]) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = data.name.toLowerCase().includes(searchLower);
      const chainIdMatch = chainId.toLowerCase().includes(searchLower);
      const descriptionMatch = data.description.toLowerCase().includes(searchLower);
      const searchMatch = nameMatch || chainIdMatch || descriptionMatch;

      const hostingMatch = filters.hosting.length === 0 || filters.hosting.includes(data.explorers[0].hostedBy);
      const networkTypeMatch = filters.networkTypes.length === 0 ||
        filters.networkTypes.includes(`l${data.layer}`) ||
        filters.networkTypes.includes(data.isTestnet ? 'testnet' : 'mainnet') ||
        (data.rollupType && filters.networkTypes.includes(`${data.rollupType}_rollup`));
      const ecosystemMatch = filters.ecosystems.length === 0 || filters.ecosystems.includes(data.ecosystem.toLowerCase());

      return searchMatch && hostingMatch && networkTypeMatch && ecosystemMatch;
    });
  }, [chainsData, searchTerm, filters]);

  useEffect(() => {
    async function loadChainsData() {
      try {
        const data = await getChainsData();
        setChainsData(data);
      } catch (err) {
        setError('Failed to load chains data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadChainsData();
  }, []);

  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <main className="max-w-[1376px] mx-auto pt-24 pb-[100px] sm:px-6 lg:px-10">
      <div className="flex flex-col items-center px-4 sm:px-0">
        <h1 className="text-[42px] md:text-[54px] lg:text-7xl leading-[1.08em] font-semibold text-center mb-12">
          Chains & Projects<br />Using Blockscout
        </h1>
        <SearchBar onSearch={setSearchTerm} />
        <div className="w-full mt-16 mb-4 flex justify-between items-center">
          <div className="text-[22px] font-semibold text-[#6b6b74]">
            {filteredChains.length} Results
          </div>
          <Filters
            filters={filters}
            setFilters={setFilters}
            ecosystems={ecosystems}
            appliedFiltersCount={appliedFiltersCount}
          />
        </div>
        <ChainList
          chains={Object.fromEntries(filteredChains)}
          searchTerm={searchTerm}
          isLoading={isLoading}
          filters={filters}
        />
      </div>
    </main>
  );
}
