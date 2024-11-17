'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ITweet } from '@/models/Tweet';
import { RefreshCcw } from 'lucide-react';
import LierTweetsList from './LierTweetsList';

export default function AllTweetsList() {
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchTweets = async () => {
        try {
            setIsRefreshing(true);
            const response = await fetch('/api/tweets');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch tweets');
            }

            setTweets(data);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tweets';
            setError(errorMessage);
            console.error('Error fetching tweets:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, []);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 p-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="w-full">
                        <CardContent>
                            <Skeleton className="h-48 w-full" />
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
                        <p className="text-gray-500">No Lies found.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-8xl mx-auto p-6 space-y-8">
            <LierTweetsList tweets={tweets} />
        </div>
    );
}