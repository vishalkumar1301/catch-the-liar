import dbConnect from '@/lib/mongoose';
import { NextResponse } from 'next/server';
import Tweet from '@/models/Tweet';

export async function GET() {
  await dbConnect();
  try {
    const tweets = await Tweet.find({});
    return NextResponse.json(tweets, { status: 200 });
  } catch (error) {
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
