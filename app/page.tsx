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

async function getFeaturedChains(): Promise<string[]> {
  const res = await fetch('/api/featured', {
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch featured networks');
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
  const [sortOption, setSortOption] = useState<'Featured' | 'Alphabetical'>('Featured');
  const [featuredChains, setFeaturedChains] = useState<string[]>([]);

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
    return Object.fromEntries(Object.entries(chainsData).filter(([chainId, data]) => {
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
    }));
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

  useEffect(() => {
    async function loadFeaturedChains() {
      try {
        const networks = await getFeaturedChains();
        setFeaturedChains(networks);
      } catch (err) {
        console.error('Failed to load featured networks:', err);
      }
    }

    loadFeaturedChains();
  }, []);

  const sortedAndFilteredChains = useMemo(() => {
    let sorted = Object.entries(filteredChains);

    if (sortOption === 'Featured') {
      sorted = sorted.sort((a, b) => {
        const aIndex = featuredChains.indexOf(a[0]);
        const bIndex = featuredChains.indexOf(b[0]);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return 0;
      });
    } else {
      sorted = sorted.sort((a, b) => a[1].name.localeCompare(b[1].name));
    }

    return sorted;
  }, [filteredChains, sortOption, featuredChains]);

  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <main className="pt-[143px] md:pt-[138px]">
      <div className="flex flex-col items-center custom-background">
        <div className="flex flex-col items-center px-5 pt-[60px] md:pt-24 w-full max-w-[1376px] mx-auto pb-[100px] sm:px-6 lg:px-10">
          <h1 className="font-poppins text-[#1d1d1f] text-[36px] md:text-[54px] lg:text-7xl leading-[1.08em] lg:leading-[1.08em] font-semibold text-center mb-6 md:mb-12">
            Chains & Projects<br />Using Blockscout
          </h1>
          <div className="flex flex-col w-full lg:w-[860px] mb-6 md:mb-[70px]">
            <SearchBar onSearch={setSearchTerm} />
            <PopularEcosystems
              ecosystems={popularEcosystems}
              selectedEcosystems={filters.ecosystems}
              onSelect={handleEcosystemSelect}
            />
          </div>
          <div className="w-full mb-6 flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center">
            <div className="text-lg md:text-[22px] font-semibold text-[#6b6b74]">
              {sortedAndFilteredChains.length} Results
            </div>
            <Filters
              filters={filters}
              setFilters={setFilters}
              ecosystems={ecosystems}
              appliedFiltersCount={appliedFiltersCount}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>
          <AddChainSection />
          <ChainList
            chains={sortedAndFilteredChains}
            searchTerm={searchTerm}
            isLoading={isLoading}
            filters={filters}
            featuredChains={featuredChains}
          />
        </div>
      </div>
    </main>
  );
}
