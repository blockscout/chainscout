import React from 'react';
import Link from 'next/link';

type MenuLinkProps = {
  href: string;
  target?: string;
  children: React.ReactNode;
  isMobile?: boolean;
};

const MenuLink: React.FC<MenuLinkProps> = ({ href, target, children, isMobile }) => (
  <Link
    href={href}
    target={target}
    className={isMobile
      ? "block text-lg font-medium text-[#1d1d1f]"
      : "text-sm font-medium text-[#6b6b74] hover:text-[#1761e4]"
    }
  >
    {children}
  </Link>
);

type MenuLinksProps = {
  isMobile?: boolean;
};

const MenuLinks: React.FC<MenuLinksProps> = ({ isMobile = false }) => (
  <nav className={`flex gap-8 ${isMobile ? 'flex-col' : ''}`}>
    <MenuLink href="https://eaas.blockscout.com/#features" isMobile={isMobile}>Features</MenuLink>
    <MenuLink href="https://eaas.blockscout.com/#explorer-as-a-service" isMobile={isMobile}>Explorer as a Service</MenuLink>
    <MenuLink href="https://eaas.blockscout.com/#future-updates" isMobile={isMobile}>Future Updates</MenuLink>
    <MenuLink href="https://eaas.blog.blockscout.com/" target="_blank" isMobile={isMobile}>Blog</MenuLink>
    <MenuLink href="https://docs.blockscout.com/" target="_blank" isMobile={isMobile}>Docs</MenuLink>
    <MenuLink href="https://eaas.blockscout.com/#contact" isMobile={isMobile}>Contact</MenuLink>
  </nav>
);

export default MenuLinks;
