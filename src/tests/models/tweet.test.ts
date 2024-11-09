import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Tweet, { ITweet } from '../../models/Tweet';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Tweet.deleteMany({});
});

describe('Tweet Model Test Suite', () => {
  test('should validate required fields', async () => {
    const validTweet = {
      tweetUrl: 'https://twitter.com/user/status/123',
      personName: 'John Doe'
    };
    const tweet = new Tweet(validTweet);
    const savedTweet = await tweet.save();
    
    expect(savedTweet._id).toBeDefined();
    expect(savedTweet.tweetUrl).toBe(validTweet.tweetUrl);
    expect(savedTweet.personName).toBe(validTweet.personName);
    expect(savedTweet.createdAt).toBeDefined();
    expect(savedTweet.updatedAt).toBeDefined();
  });

  test('should fail validation when required fields are missing', async () => {
    const invalidTweet = {
      tweetUrl: 'https://twitter.com/user/status/123'
    };
    
    await expect(new Tweet(invalidTweet).save()).rejects.toThrow();
  });

  test('should save tweet with optional fields', async () => {
    const tweetWithOptionals = {
      tweetUrl: 'https://twitter.com/user/status/123',
      personName: 'John Doe',
      twitterHandle: '@johndoe',
      datePosted: new Date(),
      context: 'Some context about the tweet'
    };

    const tweet = new Tweet(tweetWithOptionals);
    const savedTweet = await tweet.save();

    expect(savedTweet.twitterHandle).toBe(tweetWithOptionals.twitterHandle);
    expect(savedTweet.datePosted).toEqual(tweetWithOptionals.datePosted);
    expect(savedTweet.context).toBe(tweetWithOptionals.context);
  });

  test('should update tweet successfully', async () => {
    const tweet = new Tweet({
      tweetUrl: 'https://twitter.com/user/status/123',
      personName: 'John Doe'
    });
    await tweet.save();

    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweet._id,
      { personName: 'Jane Doe' },
      { new: true }
    );

    expect(updatedTweet?.personName).toBe('Jane Doe');
  });

  test('should delete tweet successfully', async () => {
    const tweet = new Tweet({
      tweetUrl: 'https://twitter.com/user/status/123',
      personName: 'John Doe'
    });
    await tweet.save();

    await Tweet.findByIdAndDelete(tweet._id);
    const deletedTweet = await Tweet.findById(tweet._id);

    expect(deletedTweet).toBeNull();
  });

  test('should find tweets by person name', async () => {
    await Promise.all([
      new Tweet({ tweetUrl: 'https://twitter.com/user/status/1', personName: 'John Doe' }).save(),
      new Tweet({ tweetUrl: 'https://twitter.com/user/status/2', personName: 'John Doe' }).save(),
      new Tweet({ tweetUrl: 'https://twitter.com/user/status/3', personName: 'Jane Doe' }).save()
    ]);

    const johnTweets = await Tweet.find({ personName: 'John Doe' });
    expect(johnTweets).toHaveLength(2);
  });

  test('should support pagination', async () => {
    await Promise.all([
      new Tweet({ tweetUrl: 'https://twitter.com/user/status/1', personName: 'User 1' }).save(),
      new Tweet({ tweetUrl: 'https://twitter.com/user/status/2', personName: 'User 2' }).save(),
      new Tweet({ tweetUrl: 'https://twitter.com/user/status/3', personName: 'User 3' }).save()
    ]);

    const page1 = await Tweet.find().limit(2);
    const page2 = await Tweet.find().skip(2).limit(2);

    expect(page1).toHaveLength(2);
    expect(page2).toHaveLength(1);
  });

  test('should sort tweets by datePosted', async () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-02');

    await Promise.all([
      new Tweet({ 
        tweetUrl: 'https://twitter.com/user/status/2', 
        personName: 'User 2',
        datePosted: date2 
      }).save(),
      new Tweet({ 
        tweetUrl: 'https://twitter.com/user/status/1', 
        personName: 'User 1',
        datePosted: date1 
      }).save()
    ]);

    const sortedTweets = await Tweet.find().sort({ datePosted: 1 });
    expect(sortedTweets[0].datePosted).toEqual(date1);
    expect(sortedTweets[1].datePosted).toEqual(date2);
  });

  test('should trim whitespace from string fields', async () => {
    const tweet = new Tweet({
      tweetUrl: 'https://twitter.com/user/status/123',
      personName: '  John Doe  ',
      twitterHandle: '  @johndoe  '
    });
    
    const savedTweet = await tweet.save();
    expect(savedTweet.personName).toBe('John Doe');
    expect(savedTweet.twitterHandle).toBe('@johndoe');
  });

  test('should find tweets by multiple criteria', async () => {
    await Promise.all([
      new Tweet({ 
        tweetUrl: 'https://twitter.com/user/status/1', 
        personName: 'John',
        twitterHandle: '@john'
      }).save(),
      new Tweet({ 
        tweetUrl: 'https://twitter.com/user/status/2', 
        personName: 'John',
        twitterHandle: '@johnny'
      }).save()
    ]);

    const tweets = await Tweet.find({
      personName: 'John',
      twitterHandle: '@john'
    });

    expect(tweets).toHaveLength(1);
    expect(tweets[0].twitterHandle).toBe('@john');
  });

  test('should reject invalid tweet URL formats', async () => {
    const invalidUrls = [
      'htt://twitter.com/user/status/123', // Invalid protocol
      'https://twitter.com/user/status/',  // Missing ID
      'https://twitter.com//status/123',   // Missing username
      'https://twitter.com/user/status/abc' // Non-numeric ID
    ];

    for (const url of invalidUrls) {
      const tweet = new Tweet({
        tweetUrl: url,
        personName: 'John Doe'
      });
      await expect(tweet.save()).rejects.toThrow();
    }
  });

  test('should prevent saving duplicate tweet URLs', async () => {
    const tweetData = {
      tweetUrl: 'https://twitter.com/user/status/123',
      personName: 'John Doe'
    };

    const tweet1 = new Tweet(tweetData);
    await tweet1.save();

    const tweet2 = new Tweet(tweetData);
    await expect(tweet2.save()).rejects.toThrow();
  });

  test('should enforce maximum length for personName', async () => {
    const longName = 'a'.repeat(101); // Assuming the max length is 100

    const tweet = new Tweet({
      tweetUrl: 'https://twitter.com/user/status/124',
      personName: longName
    });

    await expect(tweet.save()).rejects.toThrow();
  });

  test('should reject invalid date formats for datePosted', async () => {
    const tweet = new Tweet({
      tweetUrl: 'https://twitter.com/user/status/125',
      personName: 'Jane Doe',
      datePosted: 'invalid-date' as any
    });

    await expect(tweet.save()).rejects.toThrow();
  });

  test('should handle empty strings for optional fields gracefully', async () => {
    const tweet = new Tweet({
      tweetUrl: 'https://twitter.com/user/status/126',
      personName: 'Alice',
      twitterHandle: '',
      context: ''
    });

    const savedTweet = await tweet.save();

    expect(savedTweet.twitterHandle).toBe('');
    expect(savedTweet.context).toBe('');
  });
});