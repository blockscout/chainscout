import React, { useState, useEffect, useRef } from 'react';
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
    <h4 className="font-medium mb-1">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {Object.entries(items).map(([key, value]) => (
        <button
          key={key}
          onClick={() => onItemClick(key)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedItems.includes(key)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700'
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
        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {appliedFiltersCount} Filters {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div className="absolute z-10 right-0 mt-2 w-96 bg-white border border-gray-300 rounded-md shadow-lg transition-opacity duration-200 ease-in-out opacity-100">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={clearAll}
                className="text-blue-500 hover:text-blue-700"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-4">
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
        </div>
      )}
    </div>
  );
};

export default Filters;
