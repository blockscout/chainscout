import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Chains } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const filePath = path.join(process.cwd(), 'data', 'chains.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const chainsData: Chains = JSON.parse(jsonData);

    if (chainsData[id]) {
      return NextResponse.json(chainsData[id]);
    } else {
      return NextResponse.json({ error: 'Chain not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error reading chain data:', error);
    return NextResponse.json({ error: 'Failed to load chain data' }, { status: 500 });
  }
}
