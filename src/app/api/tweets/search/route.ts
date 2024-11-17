import dbConnect from '@/lib/mongoose';
import { NextResponse } from 'next/server';
import Tweet from '@/models/Tweet';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');

    if (!term) {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    const uniqueNames = await Tweet.distinct('personName', {
      personName: { $regex: term, $options: 'i' },
      isActive: true
    });

    return NextResponse.json(uniqueNames, { status: 200 });
  } catch (error: unknown) {
    console.error('Search failed:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
} 