import { NextResponse } from 'next/server';
import { getUserStats } from '@/lib/store';

export async function GET() {
  try {
    const stats = getUserStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
  }
}
