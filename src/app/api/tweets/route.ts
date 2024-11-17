import dbConnect from '@/lib/mongoose';
import { NextResponse } from 'next/server';
import Tweet from '@/models/Tweet';

export async function GET() {
  await dbConnect();
  try {
    const tweets = await Tweet.find({ isActive: true });
    return NextResponse.json(tweets, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json({ error: 'Failed to fetch tweets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const data = await request.json();
    const tweet = new Tweet(data);
    const savedTweet = await tweet.save();
    return NextResponse.json(savedTweet, { status: 201 });
  } catch (error: unknown) {
    console.error('Error saving tweet:', error);
    return NextResponse.json({ error: 'Failed to save tweet' }, { status: 400 });
  }
}