import React from 'react';

type PopularEcosystemsProps = {
  ecosystems: string[];
  selectedEcosystems: string[];
  onSelect: (ecosystem: string) => void;
};

const PopularEcosystems: React.FC<PopularEcosystemsProps> = ({ ecosystems, selectedEcosystems, onSelect }) => {
  return (
    <div className="w-full mt-4 md:mt-6 flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center">
      <span className="text-md text-[#6b6b74]">Popular Ecosystems:</span>
      <div className="flex flex-wrap gap-2 justify-center md:justify-end">
        {ecosystems.map((ecosystem) => (
          <button
            key={ecosystem}
            onClick={() => onSelect(ecosystem)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-[400ms] ease-[cubic-bezier(.39,.575,.565,1)] ${
              selectedEcosystems.includes(ecosystem.toLowerCase())
                ? 'bg-[#2563eb] text-white'
                : 'bg-[#f2f4fc] text-[#23262f] hover:bg-[#c2d9ff] hover:text-[#003180]'
            }`}
          >
            {ecosystem}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularEcosystems;
