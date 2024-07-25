import { Chains } from '@/types';
import ChainCard from '@/components/ChainCard';

type Props = {
  chains: Chains;
  searchTerm: string;
};

export default function ChainList({ chains, searchTerm }: Props) {
  const filteredChains = Object.entries(chains).filter(([_, data]) =>
    data.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chain-list-container mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {filteredChains.map(([chainId, data]) => (
        <ChainCard key={chainId} chainId={chainId} {...data} />
      ))}
    </div>
  );
}
