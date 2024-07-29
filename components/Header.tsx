import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white">
      <div className="flex items-center h-20 max-w-[1376px] mx-auto py-6 sm:px-6 lg:px-10">
        <Image src="/logo.svg" alt="Chainscout Logo" width={115} height={22} />
      </div>
    </header>
  );
}
