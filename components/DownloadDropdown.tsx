import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import CsvIcon from '@/icons/csv.svg';
import JsonIcon from '@/icons/json.svg';
import { ChainData } from '@/types';

type DownloadOption = {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  format: 'csv' | 'json';
};

const downloadOptions: DownloadOption[] = [
  { label: 'CSV', Icon: CsvIcon, format: 'csv' },
  { label: 'JSON', Icon: JsonIcon, format: 'json' },
];

type DownloadDropdownProps = {
  chains: Array<[string, ChainData]>;
};

const csvColumns = [
  'chainId',
  'name',
  'description',
  'ecosystem',
  'isTestnet',
  'layer',
  'rollupType',
  'website',
  'logo',
  'explorerUrl',
  'hostedBy',
] as const;

const escapeCsvValue = (value: unknown) => {
  const stringValue = Array.isArray(value) || (value && typeof value === 'object')
    ? JSON.stringify(value)
    : String(value ?? '');

  return `"${stringValue.replace(/"/g, '""')}"`;
};

const buildCsv = (chains: Array<[string, ChainData]>) => {
  const rows = chains.map(([chainId, data]) => {
    const values = {
      chainId,
      name: data.name,
      description: data.description,
      ecosystem: data.ecosystem,
      isTestnet: data.isTestnet,
      layer: data.layer,
      rollupType: data.rollupType,
      website: data.website,
      logo: data.logo,
      explorerUrl: data.explorers[0]?.url,
      hostedBy: data.explorers[0]?.hostedBy,
    };

    return csvColumns.map((column) => escapeCsvValue(values[column])).join(',');
  });

  return [csvColumns.join(','), ...rows].join('\n');
};

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const DownloadDropdown: React.FC<DownloadDropdownProps> = ({ chains }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDownload = (format: DownloadOption['format']) => {
    if (format === 'json') {
      downloadFile(
        JSON.stringify(Object.fromEntries(chains), null, 2),
        'chainscout-networks.json',
        'application/json;charset=utf-8'
      );
    } else {
      downloadFile(
        buildCsv(chains),
        'chainscout-networks.csv',
        'text/csv;charset=utf-8'
      );
    }

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-[44px] py-2.5 pr-3 pl-4 border border-[#d0d5dd] rounded-lg text-sm font-medium text-[#23262f] hover:bg-[#f2f4fc] focus:outline-none focus:border-[#85888e] transition-colors"
      >
        Download
        <Image
          src="/arrow-down.svg"
          alt="arrow"
          width={20}
          height={20}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 left-0 mt-2 min-w-[125px] bg-white rounded-[10px] shadow-[0_0_1px_rgba(0,0,0,.25),10px_0_32px_rgba(104,107,116,.02),12px_0_36px_rgba(33,41,41,.12)]">
          <div className="py-2">
            {downloadOptions.map(({ label, Icon, format }) => (
              <button
                key={label}
                className="flex items-center w-full text-left px-3 py-2 text-sm text-[#1D1D1F] hover:text-[#2563eb] transition-colors"
                onClick={() => handleDownload(format)}
              >
                <Icon className="mr-2 h-6 w-6 text-current" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadDropdown;
