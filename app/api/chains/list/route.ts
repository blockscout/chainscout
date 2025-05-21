import { NextResponse } from 'next/server';
import { Chains } from '@/types';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'chains.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const chainsData: Chains = JSON.parse(jsonData);

    const mappedData = Object.entries(chainsData).map(([chainid, { name }]) => ({
      name,
      chainid,
    }));

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error('Error reading chains data:', error);
    return NextResponse.json({ error: 'Failed to load chains data' }, { status: 500 });
  }
}
