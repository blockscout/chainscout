import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ExplorerDropdownProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

const DropdownItem: React.FC<{ href: string; children: React.ReactNode; isMobile: boolean }> = ({ href, children, isMobile }) => (
  <Link
    href={href}
    className={`block px-4 py-2 text-sm text-[#646474] hover:text-[#1668f9] ${isMobile ? 'py-1.5' : 'py-2'}`}
  >
    {children}
  </Link>
);


const ExplorerDropdown: React.FC<ExplorerDropdownProps> = ({ isMobile = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonClasses = isMobile ? 'w-full text-md py-5 px-6' : 'h-[46px] w-[170px] text-sm pl-4 pr-2.5';
  const dropdownClasses = isMobile ? 'left-0 w-full' : 'w-[170px]';

  const handleClose = () => {
    setIsOpen(false);
    onClose && onClose();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between bg-transparent font-semibold text-[#1d1d1f] rounded-lg border border-[#dcdddd] hover:border-[#1668f9] transition-colors duration-[800ms] ease-in-out ${buttonClasses}`}
      >
        Use the Explorer
        <Image
          src="/arrow-down-2.svg"
          alt="arrow"
          width={20}
          height={20}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className={`absolute right-0 mt-1 bg-white rounded-md py-2 shadow-[0_12px_36px_#2129291a,0_0_1px_#00000040] ${dropdownClasses}`}>
          {[
            { href: 'https://optimism.blockscout.com/', text: 'Optimism' },
            { href: 'https://eth.blockscout.com/', text: 'Ethereum' },
            { href: 'https://etc.blockscout.com/', text: 'Ethereum Classic' },
            { href: 'https://zksync.blockscout.com/', text: 'zkSync Era' },
            { href: 'https://base.blockscout.com/', text: 'Base' },
            { href: 'https://gnosis.blockscout.com/', text: 'Gnosis' },
          ].map(({ href, text }) => (
            <DropdownItem key={href} href={href} isMobile={isMobile}>{text}</DropdownItem>
          ))}
          <Link
            href="/"
            onClick={handleClose}
            className="block px-4 py-2 text-sm text-[#1761e4] hover:opacity-80 font-semibold leading-6"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
};

export default ExplorerDropdown;
