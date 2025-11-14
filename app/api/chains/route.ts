import { NextResponse, NextRequest } from 'next/server';
import { Chains } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import { pickBy } from 'es-toolkit';

export async function GET(_req: NextRequest) {
  try {
    const chainIds = _req.nextUrl.searchParams.get('chain_ids')?.split(',');
    const filePath = path.join(process.cwd(), 'data', 'chains.json');
    const jsonData = await fs.readFile(filePath, 'utf8');

    const chainsData: Chains = JSON.parse(jsonData);
    const filteredChains = chainIds && chainIds.length > 0 ? 
      pickBy(chainsData, (_, chainId) => chainIds.includes(String(chainId))) : 
      chainsData;

    return NextResponse.json(filteredChains);
  } catch (error) {
    console.error('Error reading chains data:', error);
    return NextResponse.json({ error: 'Failed to load chains data' }, { status: 500 });
  }
}
