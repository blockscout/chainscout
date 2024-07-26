import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { HOSTING_PROVIDERS, ROLLUP_TYPES, NETWORK_TYPES, capitalizeFirstLetter } from '@/utils/constants';

type FilterCategories = 'hosting' | 'networkTypes' | 'ecosystems';

type Filters = {
  [K in FilterCategories]: string[];
};

type FilterItemProps = {
  title: string;
  items: Record<string, string>;
  selectedItems: string[];
  onItemClick: (item: string) => void;
  category: FilterCategories;
};

const FilterItem: React.FC<FilterItemProps> = ({ title, items, selectedItems, onItemClick }) => (
  <div>
    <p className="text-xs font-semibold text-[#777e90] mb-3">
      {title.toUpperCase()}
    </p>
    <div className="flex flex-wrap gap-2">
      {Object.entries(items).map(([key, value]) => (
        <button
          key={key}
          onClick={() => onItemClick(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedItems.includes(key)
              ? 'bg-[#2563eb] text-white'
              : 'bg-[#f2f4fc] text-[#23262f] hover:bg-[#c2d9ff] hover:text-[#003180]'
          }`}
        >
          {value}
        </button>
      ))}
    </div>
  </div>
);

type FiltersProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  ecosystems: string[];
  appliedFiltersCount: number;
};

const Filters: React.FC<FiltersProps> = ({ filters, setFilters, ecosystems, appliedFiltersCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (category: FilterCategories, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: prevFilters[category].includes(value)
        ? prevFilters[category].filter(item => item !== value)
        : [...prevFilters[category], value]
    }));
  };

  const clearAll = () => {
    setFilters({ hosting: [], networkTypes: [], ecosystems: [] });
  };

  const networkTypes = {
    ...NETWORK_TYPES,
    ...Object.fromEntries(
      Object.entries(ROLLUP_TYPES).map(([key, value]) => [`${key}_rollup`, `${value} Rollup`])
    )
  };

  const ecosystemItems = Object.fromEntries(
    ecosystems.map(eco => [eco.toLowerCase(), capitalizeFirstLetter(eco)])
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-[46px] gap-2 p-[10px_12px_10px_16px] border border-[#d0d5dd] rounded-lg text-sm font-medium text-[#23262f] hover:bg-[#f2f4fc] focus:outline-none focus:border-[#85888e] transition-colors"
      >
        {appliedFiltersCount > 0 && (
          <div className="h-6 min-w-6 px-[3px] text-sm text-semibold text-white bg-[#23262f] rounded-full flex items-center justify-center">
            {appliedFiltersCount}
          </div>
        )}
        Filters
        <Image src="/arrow-down.svg" alt="arrow" width={20} height={20} />
      </button>
      {isOpen && (
        <div className="absolute z-10 right-0 mt-2 w-[calc(100vw-32px)] lg:w-[750px] bg-white rounded-[10px] shadow-[0_0_1px_rgba(0,0,0,.25),10px_0_32px_rgba(104,107,116,.02),12px_0_36px_rgba(33,41,41,.12)] transition-opacity duration-200 ease-in-out opacity-100">
          <div className="flex justify-between items-center p-4 border-b border-[#e6e8ec]">
            <h3 className="text-sm font-medium">{appliedFiltersCount} applied filters</h3>
            <button
              onClick={clearAll}
              className="text-sm font-medium text-[#2563eb] hover:opacity-85 transition-opacity"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-4 p-4">
            <FilterItem
              title="Hosting"
              items={HOSTING_PROVIDERS}
              selectedItems={filters.hosting}
              onItemClick={(item) => handleFilterChange('hosting', item)}
              category="hosting"
            />
            <FilterItem
              title="Network Types"
              items={networkTypes}
              selectedItems={filters.networkTypes}
              onItemClick={(item) => handleFilterChange('networkTypes', item)}
              category="networkTypes"
            />
            <FilterItem
              title="Ecosystem"
              items={ecosystemItems}
              selectedItems={filters.ecosystems}
              onItemClick={(item) => handleFilterChange('ecosystems', item)}
              category="ecosystems"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
