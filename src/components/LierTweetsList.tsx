import { useEffect } from 'react';
import { ITweet } from '@/models/Tweet';
import LierTweet from './LierTweet';
import useTwitterWidgets from '@/hooks/useTwitterWidgets';
import styles from './LierTweetsList.module.css';

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
    <div className={styles.tweetsGrid}>
      {tweets.map((tweet) => (
        <div key={tweet._id} className="break-inside-avoid">
          <LierTweet tweet={tweet} />
        </div>
      ))}
    </div>
  );
} 