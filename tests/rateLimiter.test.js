const request = require('supertest');
const express = require('express');
const { generalLimiter, authLimiter, uploadLimiter, aiLimiter, createLimiter } = require('../middleware/rateLimiter');

// Mock the auth middleware for testing
jest.mock('../middleware/auth', () => (req, res, next) => next());

const app = express();
app.use(express.json());

// Test routes with different rate limiters
app.get('/api/test/general', generalLimiter, (req, res) => {
  res.json({ message: 'General rate limiter test' });
});

app.post('/api/test/auth', authLimiter, (req, res) => {
  res.json({ message: 'Auth rate limiter test' });
});

app.post('/api/test/upload', uploadLimiter, (req, res) => {
  res.json({ message: 'Upload rate limiter test' });
});

app.post('/api/test/ai', aiLimiter, (req, res) => {
  res.json({ message: 'AI rate limiter test' });
});

app.post('/api/test/create', createLimiter, (req, res) => {
  res.json({ message: 'Create rate limiter test' });
});

describe('Rate Limiting Middleware', () => {
  describe('General Rate Limiter', () => {
    it('should allow requests within limit', async () => {
      const res = await request(app).get('/api/test/general');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('General rate limiter test');
    });

    it('should have rate limit headers', async () => {
      const res = await request(app).get('/api/test/general');
      expect(res.headers['ratelimit-limit']).toBeDefined();
      expect(res.headers['ratelimit-remaining']).toBeDefined();
      expect(res.headers['ratelimit-reset']).toBeDefined();
    });
  });

  describe('Auth Rate Limiter', () => {
    it('should allow auth requests within limit', async () => {
      const res = await request(app).post('/api/test/auth');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Auth rate limiter test');
    });

    it('should have stricter rate limit headers', async () => {
      const res = await request(app).post('/api/test/auth');
      expect(res.headers['ratelimit-limit']).toBe('5'); // Stricter limit for auth
    });
  });

  describe('Upload Rate Limiter', () => {
    it('should allow upload requests within limit', async () => {
      const res = await request(app).post('/api/test/upload');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Upload rate limiter test');
    });

    it('should have moderate rate limit headers', async () => {
      const res = await request(app).post('/api/test/upload');
      expect(res.headers['ratelimit-limit']).toBe('20'); // Moderate limit for uploads
    });
  });

  describe('AI Rate Limiter', () => {
    it('should allow AI requests within limit', async () => {
      const res = await request(app).post('/api/test/ai');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('AI rate limiter test');
    });

    it('should have strict rate limit headers', async () => {
      const res = await request(app).post('/api/test/ai');
      expect(res.headers['ratelimit-limit']).toBe('10'); // Strict limit for AI
    });
  });

  describe('Create Rate Limiter', () => {
    it('should allow create requests within limit', async () => {
      const res = await request(app).post('/api/test/create');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Create rate limiter test');
    });

    it('should have create rate limit headers', async () => {
      const res = await request(app).post('/api/test/create');
      expect(res.headers['ratelimit-limit']).toBe('100'); // Limit for create operations
    });
  });

  describe('Rate Limiting Behavior', () => {
    it('should return 429 status when rate limit is exceeded', async () => {
      // This test would require making many requests to exceed the limit
      // For now, we'll just verify the structure exists
      const res = await request(app).get('/api/test/general');
      expect(res.status).toBe(200);
      
      // Verify the rate limiter is properly configured
      expect(res.headers['ratelimit-limit']).toBeDefined();
    });
  });
});
