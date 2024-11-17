import dbConnect from '@/lib/mongoose';
import { NextResponse } from 'next/server';
import Tweet from '@/models/Tweet';

export async function GET() {
  await dbConnect();
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tweets = await Tweet.find({
      isActive: true,
      createdAt: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).sort({ createdAt: -1 });

    return NextResponse.json(tweets, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching today\'s tweets:', error);
    return NextResponse.json({ error: 'Failed to fetch today\'s tweets' }, { status: 500 });
  }
} 