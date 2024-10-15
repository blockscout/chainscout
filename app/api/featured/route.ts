import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'featured.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const featuredNetworks: string[] = JSON.parse(jsonData);

    return NextResponse.json(featuredNetworks);
  } catch (error) {
    console.error('Error reading featured networks data:', error);
    return NextResponse.json({ error: 'Failed to load featured networks data' }, { status: 500 });
  }
}
