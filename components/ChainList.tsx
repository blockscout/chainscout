import { Chains } from '@/types';
import ChainCard from '@/components/ChainCard';
import SkeletonCard from '@/components/SkeletonCard';

type Props = {
  chains: Chains;
  searchTerm: string;
  isLoading: boolean;
};

export default function ChainList({ chains, searchTerm, isLoading }: Props) {
  const filteredChains = Object.entries(chains).filter(([_, data]) =>
    data.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="w-full mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(12)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {filteredChains.map(([chainId, data]) => (
        <ChainCard key={chainId} chainId={chainId} {...data} />
      ))}
    </div>
  );
}
