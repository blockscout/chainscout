import React from 'react';
import Link from 'next/link';

const AddChainSection: React.FC = () => {
  return (
    <div className="w-full py-2 px-4 bg-[#f7f8fd] border border-[#f2f4fc] rounded-lg flex items-center justify-center gap-4 mb-6">
      <p className="text-[#1d1d1f] text-sm">
        Does your network use Blockscout but isn&apos;t listed here? Add your chain now!
      </p>
      <Link
        href="https://github.com/blockscout/chainscout?tab=readme-ov-file#contributing"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center h-[34px] border border-[#2563eb] text-[13px] text-[#2563eb] font-semibold px-3 rounded-lg hover:opacity-75 transition-opacity duration-[400ms]"
      >
        Add your Chain
      </Link>
    </div>
  );
};

export default AddChainSection;
