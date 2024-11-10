'use client';

import TweetForm from '@/components/TweetForm';

export default function SubmitPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Submit New Tweet</h1>
      <TweetForm />
    </div>
  );
} 