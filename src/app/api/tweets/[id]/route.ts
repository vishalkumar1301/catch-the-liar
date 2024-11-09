import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Tweet from '@/models/Tweet';
import dbConnect from '@/lib/mongoose';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid Tweet ID' }, { status: 400 });
  }

  try {
    const tweet = await Tweet.findById(id);
    if (!tweet) {
      return NextResponse.json({ error: 'Tweet not found' }, { status: 404 });
    }
    return NextResponse.json(tweet, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tweet' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid Tweet ID' }, { status: 400 });
  }

  try {
    const data = await request.json();
    const updatedTweet = await Tweet.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedTweet) {
      return NextResponse.json({ error: 'Tweet not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTweet, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid Tweet ID' }, { status: 400 });
  }

  try {
    const deletedTweet = await Tweet.findByIdAndDelete(id);
    if (!deletedTweet) {
      return NextResponse.json({ error: 'Tweet not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Tweet deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tweet' }, { status: 500 });
  }
}
