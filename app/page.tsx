'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import ChainList from '@/components/ChainList';
import { Chains } from '@/types';

async function getChainsData(): Promise<Chains> {
  const res = await fetch('http://localhost:3000/api/chains');
  if (!res.ok) {
    throw new Error('Failed to fetch chains data');
  }
  return res.json();
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [chainsData, setChainsData] = useState<Chains | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!chainsData) return <div>No data available</div>;

  return (
    <main className="max-w-[1376px] mx-auto py-6 sm:px-6 lg:px-10">
      <div className="flex flex-col items-center px-4 py-6 sm:px-0">
        <h1 className="text-[42px] md:text-[54px] lg:text-7xl leading-[1.08em] font-semibold text-center mb-12">
          Chains & Projects<br />Using Blockscout
        </h1>
        <SearchBar onSearch={setSearchTerm} />
        <ChainList chains={chainsData} searchTerm={searchTerm} />
      </div>
    </main>
  );
}
