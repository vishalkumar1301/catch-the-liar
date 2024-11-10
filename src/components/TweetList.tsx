'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ITweet } from '@/models/Tweet';
import { format } from 'date-fns';
import { Calendar, Link, MessageCircle, RefreshCcw } from 'lucide-react';
import LierTweet from '@/components/LierTweet';

declare global {
    interface Window {
        twttr: any;
    }
}

export default function TweetList() {
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
        } catch (error: any) {
            setError(error.message);
            console.error('Error fetching tweets:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, []);

    useEffect(() => {
        const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
        if (existingScript) {
            document.body.removeChild(existingScript);
        }

        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
            if (window.twttr) {
                window.twttr.widgets.load();
            }
        };

        document.body.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [tweets]);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 p-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="w-full">
                        <CardHeader>
                            <Skeleton className="h-8 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-4 w-32 mt-4" />
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
                        <p className="text-gray-500">No tweets found.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-8xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Saved Tweets
                </h2>
                <button
                    onClick={fetchTweets}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                    <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 [column-fill:_balance]">
                {tweets.map((tweet) => (
                    <div key={tweet._id} className="break-inside-avoid mb-8">
                        <LierTweet tweet={tweet} />
                    </div>
                ))}
            </div>
        </div>
    );
}