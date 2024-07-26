import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white">
      <div className="flex items-center h-20 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Image src="/logo.svg" alt="Chainscout Logo" width={115} height={22} />
      </div>
    </header>
  );
}
