import Image from 'next/image';
import Link from 'next/link';

type MenuLinkProps = {
  href: string;
  target?: string;
  children: React.ReactNode;
};

const MenuLink = ({ href, target, children }: MenuLinkProps) => (
  <Link href={ href } target={ target } className="text-sm font-medium text-[#6b6b74] hover:text-[#1761e4]">
    {children}
  </Link>
);


export default function Header() {
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
          <button className="w-[170px] bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Use the Explorer
          </button>
        </div>
      </div>
    </header>
  );
}
