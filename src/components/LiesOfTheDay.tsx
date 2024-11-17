'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ITweet } from '@/models/Tweet';
import LierTweetsList from './LierTweetsList';

export default function LiesOfTheDay() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodaysTweets() {
      try {
        const response = await fetch('/api/tweets/today');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch today\'s lies');
        }

        setTweets(data);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch today\'s lies';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodaysTweets();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardContent>
              <div className="h-48 bg-gray-200 animate-pulse rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-gray-500">No lies found today.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto space-y-8">
      <LierTweetsList tweets={tweets} />
    </div>
  );
} 