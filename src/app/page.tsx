'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, List } from "lucide-react";
import TweetSearch from '@/components/TweetSearch';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
                <CardDescription>Quick access to main features</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Link href="/submit" className="w-full">
                  <Button className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Submit New Tweet
                  </Button>
                </Link>
                <Link href="/tweets" className="w-full">
                  <Button variant="outline" className="w-full">
                    <List className="mr-2 h-4 w-4" />
                    View All Tweets
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <div className="w-full md:w-2/3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search Tweets</CardTitle>
                  <CardDescription>Find Lies told by person's name</CardDescription>
                </CardHeader>
                <CardContent>
                  <TweetSearch />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
