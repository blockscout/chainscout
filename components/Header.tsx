'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type MenuLinkProps = {
  href: string;
  target?: string;
  children: React.ReactNode;
};

type DropdownItemProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

const MenuLink = ({ href, target, children }: MenuLinkProps) => (
  <Link href={href} target={target} className="text-sm font-medium text-[#6b6b74] hover:text-[#1761e4]">
    {children}
  </Link>
);

const DropdownItem = ({ href, className, children }: DropdownItemProps) => (
  <Link
    href={href}
    target="_blank"
    className={`block px-4 py-2 text-sm text-[#646474] hover:text-[#1668f9] ${className || ''}`}
  >
    {children}
  </Link>
);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed w-full z-10">
      <div className="bg-[#161616] text-white text-sm h-[44px] flex items-center justify-center gap-[14px]">
        <span>Support Open Source 🔭</span>
        <Link href="#" className="underline">
          Donate to Blockscout Today!
        </Link>
      </div>
      <div className="flex items-center justify-center bg-white h-[94px]">
        <div className="flex items-center justify-between w-full max-w-[1376px] px-4 sm:px-6 lg:px-10">
          <div className="w-[170px]">
            <Image src="/logo.svg" alt="Blockscout Logo" width={115} height={22} />
          </div>
          <div className="flex items-center gap-8">
            <MenuLink href="https://www.blockscout.com/#features">Features</MenuLink>
            <MenuLink href="https://www.blockscout.com/#explorer-as-a-service">Explorer as a Service</MenuLink>
            <MenuLink href="https://www.blockscout.com/#future-updates">Future Updates</MenuLink>
            <MenuLink href="https://www.blog.blockscout.com/" target="_blank">Blog</MenuLink>
            <MenuLink href="https://docs.blockscout.com/" target="_blank">Docs</MenuLink>
            <MenuLink href="https://www.blockscout.com/#contact">Contact</MenuLink>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center h-[46px] w-[170px] bg-transparent text-sm font-semibold text-[#1d1d1f] pl-4 pr-2 rounded-lg border ${isOpen ? 'border-[#1668f9]' : 'border-[#dcdddd]'} hover:border-[#1668f9] transition-colors duration-[800ms] ease-in-out ease-[cubic-bezier(.39,.575,.565,1)]`}
            >
              Use the Explorer
              <Image
                src="/arrow-down-2.svg"
                alt="arrow"
                width={20}
                height={20}
                className={`ml-2.5 transition-transform duration-300 ${isOpen ? 'scale-y-[-1]' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-1 w-[170px] bg-white rounded-md py-2 shadow-[0_12px_36px_#2129291a,0_0_1px_#00000040]">
                <DropdownItem href="https://optimism.blockscout.com/">Optimism</DropdownItem>
                <DropdownItem href="https://eth.blockscout.com/">Ethereum</DropdownItem>
                <DropdownItem href="https://etc.blockscout.com/">Ethereum Classic</DropdownItem>
                <DropdownItem href="https://zksync.blockscout.com/">zkSync Era</DropdownItem>
                <DropdownItem href="https://base.blockscout.com/">Base</DropdownItem>
                <DropdownItem href="https://gnosis.blockscout.com/">Gnosis</DropdownItem>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-[#1761e4] hover:opacity-80 font-semibold leading-6"
                >
                  View all
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
