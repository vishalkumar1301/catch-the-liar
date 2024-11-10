import { useEffect } from 'react';
import { ITweet } from '@/models/Tweet';
import LierTweet from './LierTweet';
import useTwitterWidgets from '@/hooks/useTwitterWidgets';

interface LierTweetsListProps {
  tweets: ITweet[];
}


export default function LierTweetsList({ tweets }: LierTweetsListProps) {
  useTwitterWidgets();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('twttr' in window)) {
      window.twttr.widgets.load();
    }
  }, [tweets]);

  if (tweets.length === 0) {
    return null;
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 [column-fill:_balance]">
      {tweets.map((tweet) => (
        <div key={tweet._id} className="break-inside-avoid mb-8">
          <LierTweet tweet={tweet} />
        </div>
      ))}
    </div>
  );
} 