import { GET, POST } from '@/app/api/tweets/route';
import dbConnect from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Tweet from '@/models/Tweet';

describe('/api/tweets API Route Test Suite', () => {
  beforeAll(async () => {
    await dbConnect();
  });

  afterAll(async () => {
    await Tweet.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Tweet.deleteMany({});
  });

  describe('GET /api/tweets', () => {
    test('should return empty array when no tweets are present', async () => {
      const req = new NextRequest('http://localhost/api/tweets');
      const res = await GET(req);

      const data = await res.json();
      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });

    test('should return all existing tweets', async () => {
      const tweet1 = new Tweet({
        tweetUrl: 'https://twitter.com/user/status/1',
        personName: 'User One',
      });
      const tweet2 = new Tweet({
        tweetUrl: 'https://twitter.com/user/status/2',
        personName: 'User Two',
      });
      await tweet1.save();
      await tweet2.save();

      const req = new NextRequest('http://localhost/api/tweets');
      const res = await GET(req); // Now matches the updated GET signature

      const data = await res.json();
      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0].personName).toBe('User One');
      expect(data[1].personName).toBe('User Two');
    });
  });

  describe('POST /api/tweets', () => {
    test('should create a new tweet successfully', async () => {
      const tweetData = {
        tweetUrl: 'https://twitter.com/user/status/123',
        personName: 'John Doe',
      };
      const req = new NextRequest('http://localhost/api/tweets', {
        method: 'POST',
        body: JSON.stringify(tweetData),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await POST(req);

      const data = await res.json();
      expect(res.status).toBe(201);
      expect(data.tweetUrl).toBe(tweetData.tweetUrl);
      expect(data.personName).toBe(tweetData.personName);
      expect(data._id).toBeDefined();
    });

    test('should return 400 error for invalid tweet data', async () => {
      const invalidTweetData = {
        // Missing 'personName'
        tweetUrl: 'invalid-url',
      };
      const req = new NextRequest('http://localhost/api/tweets', {
        method: 'POST',
        body: JSON.stringify(invalidTweetData),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await POST(req);

      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    test('should prevent creating duplicate tweet URLs', async () => {
      const tweetData = {
        tweetUrl: 'https://twitter.com/user/status/123',
        personName: 'John Doe',
      };
      const tweet = new Tweet(tweetData);
      await tweet.save();

      const req = new NextRequest('http://localhost/api/tweets', {
        method: 'POST',
        body: JSON.stringify(tweetData),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await POST(req);

      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });
});