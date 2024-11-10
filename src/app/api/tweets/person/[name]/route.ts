import dbConnect from '@/lib/mongoose';
import { NextResponse } from 'next/server';
import Tweet from '@/models/Tweet';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const pathParts = new URL(request.url).pathname.split('/');
    const encodedName = pathParts[pathParts.length - 1];
    const decodedName = decodeURIComponent(encodedName);
    
    const tweets = await Tweet.find({ 
      personName: decodedName 
    }).sort({ datePosted: -1 });
    
    return NextResponse.json(tweets, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tweets' }, 
      { status: 500 }
    );
  }
} 