import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';

type Props = {
  onSearch: (term: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [term, setTerm] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledSearch = useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onSearch(value);
      }, 300);
    },
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    throttledSearch(value);
  };

  return (
    <div className="relative w-full lg:w-[860px]">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Image src="/search.svg" alt="search" width={24} height={24} />
      </div>
      <input
        type="text"
        className="w-full text-[#23262f] border border-[#d0d5dd] rounded-[10px] h-[56px] mb-0 pl-12 pr-4 py-4 text-lg leading-[1.55em] transition-colors duration-400 ease-in-out shadow-[1px_0_2px_rgba(16,24,40,0.05)] focus:outline-none focus:border-[#2563eb]"
        style={{ fontSize: '18px' }}
        placeholder="Search for something"
        value={term}
        onChange={handleChange}
      />
    </div>
  );
}
