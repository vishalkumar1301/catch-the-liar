'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ITweet } from '@/models/Tweet';
import LierTweetsList from '@/components/LierTweetsList';
import { Card, CardContent } from "@/components/ui/card";

export default function PersonTweetsPage() {
  const params = useParams();
  const personName = decodeURIComponent(params.name as string);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPersonTweets() {
      try {
        const response = await fetch(`/api/tweets/person/${encodeURIComponent(personName)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tweets');
        }

        setTweets(data);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tweets';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPersonTweets();
  }, [personName]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Loading tweets...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Lies Surrounding {personName}
        </h1>
      </div>
      <LierTweetsList tweets={tweets} />
    </div>
  );
} 