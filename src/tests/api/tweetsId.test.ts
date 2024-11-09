import { GET, PUT, DELETE } from '@/app/api/tweets/[id]/route';
import Tweet from '@/models/Tweet';
import dbConnect from '@/lib/mongoose';
import mongoose from 'mongoose';
import { NextRequest } from 'next/server';

describe('/api/tweets/[id] API Route Test Suite', () => {
  let tweet: any;

  beforeAll(async () => {
    await dbConnect();
    tweet = new Tweet({
      tweetUrl: 'https://twitter.com/user/status/456',
      personName: 'Jane Doe',
    });
    await tweet.save();
  });

  afterAll(async () => {
    await Tweet.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Tweet.deleteMany({});
    tweet = new Tweet({
      tweetUrl: 'https://twitter.com/user/status/456',
      personName: 'Jane Doe',
    });
    await tweet.save();
  });

  describe('GET /api/tweets/[id]', () => {
    test('should retrieve a tweet by valid ID', async () => {
      const req = new NextRequest(`http://localhost/api/tweets/${tweet._id}`, {
        method: 'GET',
      });
      const res = await GET(req, { params: { id: tweet._id.toString() } });

      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.personName).toBe('Jane Doe');
      expect(data.tweetUrl).toBe('https://twitter.com/user/status/456');
    });

    test('should return 400 for invalid ID format', async () => {
      const invalidId = '12345';
      const req = new NextRequest(`http://localhost/api/tweets/${invalidId}`, {
        method: 'GET',
      });
      const res = await GET(req, { params: { id: invalidId } });

      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid Tweet ID');
    });

    test('should return 404 for non-existent tweet', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const req = new NextRequest(`http://localhost/api/tweets/${nonExistentId}`, {
        method: 'GET',
      });
      const res = await GET(req, { params: { id: nonExistentId.toString() } });

      const data = await res.json();
      expect(res.status).toBe(404);
      expect(data.error).toBe('Tweet not found');
    });
  });

  describe('PUT /api/tweets/[id]', () => {
    test('should update a tweet successfully', async () => {
      const updateData = {
        personName: 'Janet Doe',
      };
      const req = new NextRequest(`http://localhost/api/tweets/${tweet._id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await PUT(req, { params: { id: tweet._id.toString() } });

      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.personName).toBe('Janet Doe');
    });

    test('should return 400 for invalid update data', async () => {
      const invalidUpdateData = {
        tweetUrl: 'invalid-url',
      };
      const req = new NextRequest(`http://localhost/api/tweets/${tweet._id}`, {
        method: 'PUT',
        body: JSON.stringify(invalidUpdateData),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await PUT(req, { params: { id: tweet._id.toString() } });

      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    test('should return 404 for updating non-existent tweet', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateData = {
        personName: 'Non Existent',
      };
      const req = new NextRequest(`http://localhost/api/tweets/${nonExistentId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await PUT(req, { params: { id: nonExistentId.toString() } });

      const data = await res.json();
      expect(res.status).toBe(404);
      expect(data.error).toBe('Tweet not found');
    });
  });

  describe('DELETE /api/tweets/[id]', () => {
    test('should delete a tweet successfully', async () => {
      const req = new NextRequest(`http://localhost/api/tweets/${tweet._id}`, {
        method: 'DELETE',
      });
      const res = await DELETE(req, { params: { id: tweet._id.toString() } });

      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.message).toBe('Tweet deleted successfully');

      const deletedTweet = await Tweet.findById(tweet._id);
      expect(deletedTweet).toBeNull();
    });

    test('should return 400 for invalid ID format', async () => {
      const invalidId = '12345';
      const req = new NextRequest(`http://localhost/api/tweets/${invalidId}`, {
        method: 'DELETE',
      });
      const res = await DELETE(req, { params: { id: invalidId } });

      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid Tweet ID');
    });

    test('should return 404 for deleting non-existent tweet', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const req = new NextRequest(`http://localhost/api/tweets/${nonExistentId}`, {
        method: 'DELETE',
      });
      const res = await DELETE(req, { params: { id: nonExistentId.toString() } });

      const data = await res.json();
      expect(res.status).toBe(404);
      expect(data.error).toBe('Tweet not found');
    });
  });
});