'use client';

import { useState } from "react";

const sampleTweetData = {
  tweetUrl: "https://twitter.com/alexocheema/status/1855238474917441972",
  personName: "Alex Cheema",
  twitterHandle: "alexocheema",
  datePosted: new Date("2024-11-09"),
  context: "M4 Mac Mini AI Cluster discussion"
};

export default function DemoButtonClickTweetSaveToMongoDB() {
  const [isSaving, setIsSaving] = useState(false);

  const saveTweet = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleTweetData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save tweet');
      }

      alert('Tweet saved successfully!');
    } catch (error) {
      console.error('Error saving tweet:', error);
      alert('Failed to save tweet');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={saveTweet}
      disabled={isSaving}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
    >
      {isSaving ? 'Saving...' : 'Save Tweet to Database'}
    </button>
  );
} 