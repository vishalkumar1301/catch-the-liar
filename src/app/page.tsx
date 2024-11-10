'use client';

import Link from 'next/link';
import DemoButtonClickTweetSaveToMongoDB from '@/components/DemoButtonClickTweetSaveToMongoDB';
import TweetSearch from '@/components/TweetSearch';

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <nav className="mb-8 flex gap-4">
        <Link 
          href="/submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit New Tweet
        </Link>
        <Link 
          href="/tweets" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View All Tweets
        </Link>
      </nav>
      
      <div className="space-y-12">
        <div className="space-y-8">
          <h1 className="text-2xl font-bold">Search Tweets</h1>
          <TweetSearch />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Demo Tweet Submission</h2>
          <DemoButtonClickTweetSaveToMongoDB />
        </div>
      </div>
    </div>
  );
}
