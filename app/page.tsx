'use client';

import { useState, useEffect, useMemo } from 'react';
import SearchBar from '@/components/SearchBar';
import ChainList from '@/components/ChainList';
import Filters from '@/components/Filters';
import PopularEcosystems from '@/components/PopularEcosystems';
import AddChainSection from '@/components/AddChainSection';
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

  const popularEcosystems = ['Ethereum', 'Polygon', 'Optimism', 'Polkadot', 'Cosmos', 'zkSync', 'Arbitrum'];

  const ecosystems = useMemo(() => {
    if (!chainsData) return [];
    return Array.from(new Set(
      Object.values(chainsData).flatMap(chain =>
        Array.isArray(chain.ecosystem) ? chain.ecosystem : [chain.ecosystem]
      )
    ));
  }, [chainsData]);

  const appliedFiltersCount = useMemo(() => {
    return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);
  }, [filters]);

  const handleEcosystemSelect = (ecosystem: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ecosystems: prevFilters.ecosystems.includes(ecosystem.toLowerCase())
        ? prevFilters.ecosystems.filter(e => e !== ecosystem.toLowerCase())
        : [...prevFilters.ecosystems, ecosystem.toLowerCase()]
    }));
  };

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
      const ecosystemMatch = filters.ecosystems.length === 0 ||
        (Array.isArray(data.ecosystem)
          ? data.ecosystem.some(eco => filters.ecosystems.includes(eco.toLowerCase()))
          : filters.ecosystems.includes(data.ecosystem.toLowerCase()));

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
    <main className="pt-[138px]">
      <div className="flex flex-col items-center custom-background">
        <div className="flex flex-col items-center px-4 pt-24 max-w-[1376px] mx-auto pb-[100px] sm:px-6 lg:px-10">
          <h1 className="font-poppins text-[#1d1d1f] text-[42px] md:text-[54px] lg:text-7xl leading-[1.08em] lg:leading-[1.08em] font-semibold text-center mb-12">
            Chains & Projects<br />Using Blockscout
          </h1>
          <div className="flex flex-col w-full lg:w-[860px] mb-[70px]">
            <SearchBar onSearch={setSearchTerm} />
            <PopularEcosystems
              ecosystems={popularEcosystems}
              selectedEcosystems={filters.ecosystems}
              onSelect={handleEcosystemSelect}
            />
          </div>
          <div className="w-full mb-6 flex justify-between items-center">
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
          <AddChainSection />
          <ChainList
            chains={Object.fromEntries(filteredChains)}
            searchTerm={searchTerm}
            isLoading={isLoading}
            filters={filters}
          />
        </div>
      </div>
    </main>
  );
}
